const svgr = require('@svgr/core').default
const path = require('path')
const fs = require('fs')
const fsp = fs.promises
const { camelCase, upperFirst } = require('lodash')

process.on('unhandledRejection', err => {
  throw err
})

// TODO: replace this with a CLI arg
const UPDATE = true

const defaultConfig = {
  plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
  prettierConfig: {
    parser: 'typescript'
  },
  svgoConfig: {
    plugins: [{ removeViewBox: false }]
  }
}
const defaultState = { title: false }

const assetsPath = path.resolve('src', 'assets')
const atomsPath = path.resolve('src', 'components', 'atoms')

const iconOutputPath = path.resolve(atomsPath, 'icons')
const iconsPath = path.resolve(assetsPath, 'icons')
const targetIconsPath = path.resolve(iconsPath, UPDATE ? '' : 'new')

const imageOutputPath = path.resolve(atomsPath, 'images')
const imagesPath = path.resolve(assetsPath, 'images')
const targetImagesPath = path.resolve(imagesPath, UPDATE ? '' : 'new')

try {
  convertAllInDir(targetIconsPath, iconOutputPath, iconsPath, getTemplate(true))
  convertAllInDir(targetImagesPath, imageOutputPath, imagesPath, getTemplate(false))
} catch (err) {
  err.throw()
}

const indexDTsContent = `/* eslint-disable no-redeclare */

import * as web from './index.web'
import * as native from './index.native'

declare const _test: typeof web
declare const _test: typeof native

export { default } from './index.web'
export * from './index.web'
`

async function convertAllInDir(srcPath, outputPath, srcStoragePath, template) {
  if (!fs.existsSync(srcPath)) {
    console.log(`No directory ${srcPath} found`)
  }
  const files = await fsp.readdir(srcPath, { withFileTypes: true })
  const svgFiles = files.filter(dirent => dirent.isFile() && dirent.name.match(/\.svg$/))

  let filesConverted = 0

  const results = svgFiles.map(async ({ name }) => {
    const file = await fsp.readFile(path.resolve(srcPath, name))
    const svgContent = file.toString()
    const success = await convertFile(svgContent, name, outputPath, template)
    if (srcPath !== srcStoragePath) await moveFile(name, srcPath, srcStoragePath)
    if (success) filesConverted++
  })

  await Promise.all(results)
  const successes = results.filter(result => !!result)
  console.log(`Converted ${successes.length} files in ${srcPath}`)
}

async function convertFile(svgContent, filename, outputPath, template) {
  const dirName = filename.replace(/\.svg$/, '').replace(/^ic-/, '')
  const componentName = upperFirst(camelCase(dirName))

  const dirPath = path.resolve(outputPath, dirName)
  const dirExists = fs.existsSync(dirPath)
  if (dirExists) {
    if (!UPDATE) return
  } else {
    await fsp.mkdir(dirPath, { recursive: true })
  }

  await Promise.all([
    writeNativeSvgComponent(svgContent, componentName, dirPath, template),
    writeWebSvgComponent(svgContent, componentName, dirPath, template),
    writeOrReplaceFile(path.resolve(dirPath, 'index.d.ts'), indexDTsContent)
  ])

  return true
}

async function moveFile(name, srcDirPath, newDirPath) {
  const oldFilePath = path.resolve(srcDirPath, name)
  const newFilePath = path.resolve(newDirPath, name)
  await fsp.rename(oldFilePath, newFilePath)
}

async function writeWebSvgComponent(svgContent, name, componentDirPath, template) {
  const filename = 'index.web.tsx'
  await writeSvgComponent(name, svgContent, filename, componentDirPath, template)
}

async function writeNativeSvgComponent(svgContent, name, componentDirPath, template) {
  const filename = 'index.native.tsx'
  const config = { native: true }
  await writeSvgComponent(name, svgContent, filename, componentDirPath, template, config)
}

async function writeSvgComponent(name, svgContent, filename, outputPath, template, config = {}, state = {}) {
  const filePath = path.resolve(outputPath, filename)

  let tsCode
  try {
    tsCode = await svgr(
      svgContent,
      {
        template: template,
        ...defaultConfig,
        ...config
      },
      {
        componentName: name,
        ...defaultState,
        ...state
      }
    )
  } catch (err) {
    console.error(`svgr failed on file "${name}": ${err.toString()}`)
    return
  }
  await writeOrReplaceFile(filePath, tsCode)
}

async function writeOrReplaceFile(filePath, fileContent) {
  if (fs.existsSync(filePath)) await fsp.unlink(filePath)
  await fsp.writeFile(filePath, fileContent)
}

function getTemplate(isIcon) {
  return ({ template }, opts, { interfaces, componentName, props, jsx, exports }) => {
    const plugins = ['jsx', 'typescript']
    const tsTemplate = template.smart({ plugins })

    return tsTemplate.ast`import React from 'react'
${isIcon ? "import { IconProps } from '../common'" : ''}

${interfaces}

function ${componentName} ( ${isIcon ? 'props: IconProps' : props} ) {
  return (
    ${jsx}
  )
}

${exports}
`
  }
}

const svgr = require('@svgr/core').default
const path = require('path')
const fs = require('fs')
const fsp = fs.promises
const chalk = require('chalk')
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

convertAllInDir(targetIconsPath, iconOutputPath, iconsPath, getTemplate(true))
convertAllInDir(targetImagesPath, imageOutputPath, imagesPath, getTemplate(false))

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
    console.warn(chalk.bold.yellow(`No directory ${srcPath} found`))
    return
  }
  const files = await fsp.readdir(srcPath, { withFileTypes: true })
  const svgFiles = files.filter(dirent => dirent.isFile() && dirent.name.match(/\.svg$/))

  const filesCount = svgFiles.length
  const relativeSource = path.relative('.', srcPath)
  if (!filesCount) {
    console.log(chalk.blue(`No SVG files to convert in ${relativeSource}`))
    return
  }
  console.log(
    chalk.blue(`Converting ${filesCount} SVG file${svgFiles.length === 1 ? '' : 's'} in ${relativeSource}...`)
  )

  let filesConverted = 0

  const convertPromises = svgFiles.map(async ({ name }) => {
    const filePath = path.resolve(srcPath, name)
    const file = await fsp.readFile(filePath)
    const svgContent = file.toString()
    const success = await convertFile(svgContent, name, outputPath, template)
    if (success) {
      filesConverted++
    } else {
      console.warn(chalk.bold.red(`Failed to convert ${path.relative('.', filePath)}`))
    }
  })

  await Promise.all(convertPromises)
  const color = filesCount === filesConverted ? 'green' : 'yellow'
  const relativeTarget = path.relative('.', outputPath)
  console.log(
    chalk.bold[color](
      `Converted ${filesConverted} of ${filesCount} SVG file${filesCount === 1 ? '' : 's'} to ${relativeTarget}`
    )
  )
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

  try {
    await Promise.all([
      writeNativeSvgComponent(svgContent, componentName, dirPath, template),
      writeWebSvgComponent(svgContent, componentName, dirPath, template),
      writeOrReplaceFile(path.resolve(dirPath, 'index.d.ts'), indexDTsContent)
    ])
  } catch (err) {
    console.error(chalk.bold.red(`Failed to convert "${filename}": `) + err.toString())
    return false
  }

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
    // Make it clearer than in the default error that it occured inside the applied template
    err.message = ` ${chalk.bold.bgRed(' Error applying svgr template ')} ${err.message}`
    throw err
  }
  const result = await writeOrReplaceFile(filePath, tsCode)
  return result
}

async function writeOrReplaceFile(filePath, fileContent) {
  if (fs.existsSync(filePath)) await fsp.unlink(filePath)
  await fsp.writeFile(filePath, fileContent)
}

function getTemplate(isIcon) {
  return ({ template }, opts, { imports, interfaces, componentName, jsx, exports }) => {
    const plugins = ['jsx', 'typescript']
    const tsTemplate = template.smart({ plugins })
    const typedProps = `props: ${isIcon ? 'IconProps' : 'React.SVGProps<SVGSVGElement>'}`

    return tsTemplate.ast`${imports}
${isIcon ? "import { IconProps } from '../common'" : ''}

${interfaces}

const ${componentName} = ( ${typedProps} ): JSX.Element => (
  ${jsx}
)

${exports}
`
  }
}

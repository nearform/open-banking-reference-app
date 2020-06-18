const svgr = require('@svgr/core').default
const path = require('path')
const fs = require('fs')
const fsp = fs.promises
const chalk = require('chalk')
const { camelCase, upperFirst } = require('lodash')

const { argv } = require('yargs').options({
  update: {
    alias: 'u',
    describe: 'Update existing SVG components from current SVG assets',
    type: 'boolean'
  }
})
const UPDATE = !!argv.update

process.on('unhandledRejection', err => {
  throw err
})

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

const imageOutputPath = path.resolve(atomsPath, 'images')
const imagesPath = path.resolve(assetsPath, 'images')

convertAllInDir(iconOutputPath, iconsPath, true)
convertAllInDir(imageOutputPath, imagesPath, false)

const indexDTsContent = `/* eslint-disable no-redeclare */

import * as web from './index.web'
import * as native from './index.native'

declare const _test: typeof web
declare const _test: typeof native

export { default } from './index.web'
export * from './index.web'
`

async function convertAllInDir(outputPath, srcPath, isIcon) {
  if (!fs.existsSync(srcPath)) {
    console.warn(chalk.bold.yellow(`No directory ${srcPath} found`))
    return
  }
  const files = await fsp.readdir(srcPath, { withFileTypes: true })
  const svgFiles = files.filter(dirent => dirent.isFile() && dirent.name.match(/\.svg$/))
  const targetFiles = UPDATE
    ? svgFiles
    : svgFiles.filter(
        ({ name }) => !fs.existsSync(path.resolve(getTargetDirectory(name, outputPath).dirPath, 'index.d.ts'))
      )

  const filesCount = targetFiles.length
  const relativeSource = path.relative('.', srcPath)
  const relativeTarget = path.relative('.', outputPath)
  const skippedFiles = UPDATE ? 0 : svgFiles.length - filesCount
  if (skippedFiles) {
    console.log(chalk.blue(`Skipping ${skippedFiles} files in ${relativeSource} already in ${relativeTarget}`))
  }
  if (!filesCount) {
    console.log(chalk.blue(`No SVG files to convert in ${relativeSource}`))
    return
  }
  console.log(
    chalk.bold.blue(`Converting ${filesCount} SVG file${filesCount === 1 ? '' : 's'} in ${relativeSource}...`)
  )

  let filesConverted = 0

  const convertPromises = targetFiles.map(async ({ name }) => {
    const filePath = path.resolve(srcPath, name)
    const file = await fsp.readFile(filePath)
    const svgContent = file.toString()
    const template = getTemplate(isIcon, filePath)
    const success = await convertFile(svgContent, name, outputPath, template)
    if (success) {
      filesConverted++
    } else {
      console.warn(chalk.bold.red(`Failed to convert ${path.relative('.', filePath)}`))
    }
  })

  await Promise.all(convertPromises)
  const color = filesCount === filesConverted ? 'green' : 'yellow'
  console.log(
    chalk.bold[color](
      `Converted ${filesConverted} of ${filesCount} SVG file${filesCount === 1 ? '' : 's'} to ${relativeTarget}\n`
    )
  )
  if (filesConverted) updateIndex(outputPath, isIcon)
}

async function convertFile(svgContent, filename, outputPath, template) {
  const { dirName, dirPath } = getTargetDirectory(filename, outputPath)
  const componentName = getComponentName(dirName)
  const dirExists = fs.existsSync(dirPath)
  if (!dirExists) {
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

function getTargetDirectory(filename, outputPath) {
  const dirName = filename.replace(/\.svg$/, '').replace(/^ic-/, '')
  const dirPath = path.resolve(outputPath, dirName)
  return { dirName, dirPath }
}

function getComponentName(dirName) {
  return upperFirst(camelCase(dirName))
}

function getTemplate(isIcon, sourcePath) {
  const relativePath = path.relative('.', sourcePath)
  return ({ template }, opts, { imports, interfaces, componentName, jsx, exports }) => {
    const plugins = ['jsx', 'typescript']
    const tsTemplate = template.smart({ plugins })
    const typedProps = `props: ${isIcon ? 'IconProps' : 'React.SVGProps<SVGSVGElement>'}`

    const comment = `/* Generated by scripts/convert-svg from ${relativePath} */\n`

    return tsTemplate.ast`${comment}
${imports}
${isIcon ? "import { IconProps } from '../common'" : ''}

${interfaces}

const ${componentName} = ( ${typedProps} ): JSX.Element => (
  ${jsx}
)

${exports}
`
  }
}

async function updateIndex(outputPath, isIcon) {
  const filePath = path.resolve(outputPath, 'index.ts')
  console.log(chalk.blue(`Updating index at ${path.relative('.', filePath)}...`))
  const dirContents = await fsp.readdir(outputPath, { withFileTypes: true })
  const componentDirNames = []
  for (const dirent of dirContents) {
    // Asyncronously filter dirContents to valid component directories
    if (!dirent.isDirectory()) continue
    const subdirPath = path.resolve(outputPath, dirent.name)
    const subdirContents = await fsp.readdir(subdirPath, { withFileTypes: true })
    const expectedNames = ['index.d.ts', 'index.native.tsx', 'index.web.tsx']
    if (expectedNames.every(name => subdirContents.some(dirent => dirent.name === name))) {
      componentDirNames.push(dirent.name)
    }
  }

  const itemName = isIcon ? 'icon' : 'image'
  const arrName = itemName + 's'
  const proptypes = isIcon ? '<IconProps>' : ''
  const proptypeImport = isIcon ? "import { IconProps } from './common'" : ''

  const indexTs = `// Generated by scripts/convert-svg
${componentDirNames.map(dirName => `import ${getComponentName(dirName)} from './${dirName}'`).join('\n')}
${proptypeImport}

const ${arrName}: { name: string; ${itemName}: React.ComponentType${proptypes} }[] = [
${componentDirNames
  .map(
    dirName => `  {
    name: '${dirName}',
  ${itemName}: ${getComponentName(dirName)}
  }`
  )
  .join(',\n')}
]

export default ${arrName}
`
  await fsp.writeFile(filePath, indexTs)
  console.log(chalk.bold.green(`Updated index at ${path.relative('.', filePath)}\n`))
}

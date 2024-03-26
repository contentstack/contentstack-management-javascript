import fs from 'fs'
import path from 'path'
const dataFiles = './test/utility/dataFiles/'
export function jsonReader (fileName) {
  if (!fs.existsSync(`${dataFiles}${fileName}`)) {
    return
  }
  const fileContents = fs.readFileSync(`${dataFiles}${fileName}`, 'utf8')
  try {
    const object = JSON.parse(fileContents)
    return object
  } catch (err) {
    return err
  }
}

export function jsonWrite (json, fileName) {
  const jsonString = JSON.stringify(json)
  ensureDirectoryExistence(`${dataFiles}${fileName}`)
  fs.writeFileSync(`${dataFiles}${fileName}`, jsonString)
}

function ensureDirectoryExistence (filePath) {
  var dirname = path.dirname(filePath)
  if (!fs.existsSync(dirname)) {
    ensureDirectoryExistence(dirname)
    fs.mkdirSync(dirname)
  }
}

export function writeDownloadedFile (response, fileName) {
  const filePath = path.resolve(dataFiles, fileName)
  ensureDirectoryExistence(`${dataFiles}${fileName}`)
  response.data.pipe(fs.createWriteStream(filePath))
}

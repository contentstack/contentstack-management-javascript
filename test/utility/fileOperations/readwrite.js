import fs from 'fs'
import path from 'path'
const dataFiles = './test/utility/dataFiles/'
export function jsonReader (fileName) {
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

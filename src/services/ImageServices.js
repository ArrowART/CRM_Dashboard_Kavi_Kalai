import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const Saveimages = async (images, folpath) => {
  try {
    const imageMap = []
    for (const image of images) {
      const binaryData = Buffer.from(image.buffer, 'base64')
      const timestamp = new Date().getTime()
      const directoryPath = path.join(__dirname, '../../uploads', folpath)
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true })
      }
      const filename = `/${folpath}/${timestamp}_${image.originalname}`
      const tempFilePath = path.join(__dirname, '../../uploads', filename)
      fs.writeFileSync(tempFilePath, binaryData)
      imageMap.push(`uploads${filename}`)
    }
    return imageMap
  } catch (err) {
    console.log(err)
  }
}

export { Saveimages }

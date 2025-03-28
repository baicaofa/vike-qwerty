import { promises as fs } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function updateDictSize() {
  const dictFiles = await fs.readdir(join(__dirname, '..', 'public', 'dicts'))
  const dictSizes = await Promise.all(
    dictFiles.map(async (fileName) => {
      const content = await fs.readFile(join(__dirname, '..', 'public', 'dicts', fileName), { encoding: 'utf-8' })
      return [fileName, JSON.parse(content).length]
    }),
  )

  const sourceFilePath = join(__dirname, '..', 'resources', 'dictionary.ts')
  const sourceContent = await fs.readFile(sourceFilePath, { encoding: 'utf-8' })

  let newContent = sourceContent
  dictSizes.forEach(([fileName, size]) => {
    const dictId = fileName.replace('.json', '')
    const regex = new RegExp(`(id:\\s*'${dictId}'[^}]*length:\\s*)\\d+`)
    newContent = newContent.replace(regex, `$1${size}`)
  })

  await fs.writeFile(sourceFilePath, newContent, { encoding: 'utf-8' })
  console.log('Dictionary sizes updated successfully!')
}

updateDictSize().catch(console.error)

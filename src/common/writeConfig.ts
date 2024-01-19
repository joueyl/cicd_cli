import fs from 'node:fs'
import {fileURLToPath} from 'node:url'
import { dirname,resolve } from 'node:path'
export default function readConfig(config:Config[]) {
   const current = resolve(dirname(fileURLToPath(import.meta.url)),'config.json')
    fs.writeFileSync(current,JSON.stringify(config))
}
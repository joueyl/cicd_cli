import fs from 'node:fs'
import {fileURLToPath} from 'node:url'
import { dirname,resolve } from 'node:path'
export default function readConfig() {
   const current = resolve(dirname(fileURLToPath(import.meta.url)),'config.json')
    return JSON.parse(fs.readFileSync(current,{encoding: 'utf-8'})) as Config[]
}
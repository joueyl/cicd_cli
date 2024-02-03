import fs from 'node:fs'
import {fileURLToPath} from 'node:url'
import { dirname,resolve } from 'node:path'
import envPaths from 'env-paths'
export default function readConfig(config:Config[]) {
   const current = resolve(envPaths("scd").config,'config.json')
   if(!fs.existsSync(current)){
       fs.mkdirSync(current,{recursive: true})
       fs.writeFileSync(current,JSON.stringify([]),{})
    }
    fs.writeFileSync(current,JSON.stringify(config))
}
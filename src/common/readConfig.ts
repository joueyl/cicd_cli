import fs from 'node:fs'
import { dirname,resolve } from 'node:path'
import envPaths from 'env-paths'
import { Config } from '../../types/config'
export default function readConfig() {
   const current = resolve(envPaths("scd").config,'config.json')
   if(!fs.existsSync(current)){
       fs.mkdirSync(current,{recursive: true})
       fs.writeFileSync(current,JSON.stringify([]),{})
   }
    return JSON.parse(fs.readFileSync(current,{encoding: 'utf-8'})) as Config[]
}
import envPaths from "env-paths";
import fs from 'node:fs'
import {resolve} from 'node:path'
import { User } from "../../types/config";
export function readUser() {
    const current = resolve(envPaths("scd").config,'user.json')
    if(!fs.existsSync(current)){
         fs.mkdirSync(current,{recursive: true})
         fs.writeFileSync(current,JSON.stringify({}),{})
    }
     return JSON.parse(fs.readFileSync(current,{encoding: 'utf-8'})) as User
}
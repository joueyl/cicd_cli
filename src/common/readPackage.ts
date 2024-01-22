import fs from 'node:fs'
import path from 'node:path'
export default function readPackage(packagepath:string){
    return JSON.parse(fs.readFileSync(path.resolve(packagepath,'package.json')).toString())
}
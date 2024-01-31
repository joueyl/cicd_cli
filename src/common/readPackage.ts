import fs from 'node:fs'
import path from 'node:path'
export default function readPackage(packagepath:string){
    const isPackage = fs.existsSync(path.resolve(packagepath,'package.json'))
    if(isPackage){
       const packageJson = JSON.parse(fs.readFileSync(path.resolve(packagepath,'package.json')).toString())
        if(packageJson.scripts){
            return packageJson
        }
        return false
    }
}
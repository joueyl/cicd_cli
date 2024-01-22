import fs from 'node:fs'
import path from 'node:path'

export default async function readProject(projectpath:string){
    const  configList = [
        'vite.config.ts',
        'webpack.config',
        
    ]
     for (let i = 0; i < configList.length; i++) {
        try {
            console.log('引入路径','d:/cicd_cli/'+configList[i])
            console.log(await import('file://'+path.resolve(projectpath,configList[i])))
        } catch (error) {
            console.log(error)
        }
    }
}
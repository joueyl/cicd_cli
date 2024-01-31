import build from '../common/build'
import path from "node:path"
import chalk from 'chalk'
import {zipFile} from '../common/FileProcessing'
import ssh from '../common/ssh'
import fs from 'node:fs' 
export default async function run(object:Config) {
    return new Promise<string|boolean>(async (resolve, reject) => {
        try {
            console.log(chalk.blue(`${object.name} ⏳ 开始打包`))
            await build(path.resolve(object.targetDir),'npm run build')
            console.log(chalk.green(`${object.name} ✔ 打包完成`))
        } catch (error) {
            console.log(chalk.red(`${object.name} ✘ 打包失败`))
            reject(chalk.red(`${object.name} ✘ 打包失败`))
            return 
        }
        await zipFile(object.targetDir,'dist')
        await ssh.connect(object)
        const isExist =await ssh.checkFile(object.deployDir+'/dist.zip')
        if(!isExist){
            await ssh.deleteFile(object.deployDir+'/dist')
        }
        await ssh.putFile(path.resolve(object.targetDir,'./dist.zip'),object.deployDir)
        await ssh.deleteFile(object.deployDir,true)
        const isUnzip = await ssh.unZip(object.deployDir)
        await ssh.mvFile(object.deployDir)
        if(isUnzip){
            console.log(chalk.green(`${object.name} ✨ 部署完成`))
        }
        await fs.unlinkSync(path.resolve(object.targetDir,'./dist.zip'))
        const isDelete = await ssh.deleteFile(object.deployDir+'/dist')
        await ssh.deleteFile(object.deployDir+'/dist.zip')
        if(isDelete){
            console.log(chalk.green(`${object.name} ✨ 临时文件清除成功`))
        }
        resolve('success')
        ssh.ssh.dispose()
    })
}
import build from '../common/build'
import path from "node:path"
import chalk from 'chalk'
import {zipFile} from '../common/FileProcessing'
import ssh from '../common/ssh'
import fs from 'node:fs'
export default async function run(object:Config) {
    try {
        console.log(chalk.blue(`${object.name} ⏳ 开始打包`))
        await build(path.resolve(object.targetDir),'npm run build')
        console.log(chalk.green(`${object.name} ✔ 打包完成`))
    } catch (error) {
        console.log(chalk.red(`${object.name} ✘ 打包失败`))
    }
    await zipFile(object.targetDir,object.releaseDir)
    await ssh.connect(object)
    const isExist =await ssh.checkFile(object.deployDir+'/dist.zip')
    if(!isExist){
        await ssh.deleteFile(object.deployDir+'/dist')
    }
    await ssh.putFile(path.resolve(object.targetDir,'./dist.zip'),object.deployDir)
    const isExistProject = await ssh.checkFile(object.deployDir+object.releaseDir)
    await ssh.deleteFile(object.deployDir+object.releaseDir)
    const isUnzip = await ssh.unZip(object.deployDir,object.releaseDir)
    if(isUnzip){
        console.log(chalk.green(`${object.name} ✨ 部署完成`))
    }
    await fs.unlinkSync(path.resolve(object.targetDir,'./dist.zip'))
    const isDelete = await ssh.deleteFile(object.deployDir+'dist.zip')
    if(isDelete){
        console.log(chalk.green(`${object.name} ✨ 临时文件清除成功`))
    }
    ssh.ssh.dispose()
}
import chalk from 'chalk'
import {NodeSSH} from 'node-ssh'
const ssh = new NodeSSH()
function connect(object:Config) {
    return new Promise(async(resolve, reject) => {
        ssh.connect(object.ssh).then((res) => {
            console.log(chalk.green(`${object.name} 😅 服务器连接成功`))
            resolve(res)
        })
        .catch((error) => {
            console.log(chalk.red(`${object.name} 😅 服务器连接失败`))
            process.exit(0)
        })
    })
}
function checkFile(path:string) {
    return new Promise<boolean>((resolve, reject) => {
        ssh.execCommand(`ls ${path}`).then((res) => {
            if (res.stderr) {
                resolve(true)
            }else {
                resolve(false)
            }
        }).catch((error) => {
            console.log(chalk.red(`SSH 😅 服务器连接中断`))
        })
    })
    
}
function deleteFile(path:string) {
    return new Promise((resolve, reject) => {
        ssh.execCommand(`rm -rf ${path}`).then((res) => {
            if (res.stderr) {
                resolve(res.stderr)
                process.exit(0)
            }else{
                resolve(true)
            }
        })
    })
}
function putFile(path:string,remotePath:string) {
    return new Promise((resolve, reject) => {
        ssh.putFile(path,remotePath+'/dist.zip').then((res) => {
            console.log(chalk.green(`SSH 📂 文件上传成功`))
            resolve(true)
        }).catch((error) => {
            console.log(chalk.red(`SSH 🥵 文件上传失败`))
            reject(false)
        })
    })
    
}
function unZip(targetDir:string,releaseDir:string) {
    return new Promise<boolean>((resolve, reject) => {
        ssh.execCommand(`unzip dist.zip`,{ cwd: targetDir }).then((res) => {
            console.log(chalk.green(`SSH 📂 文件解压成功`))
            resolve(true)
        }).catch((error) => {
            console.log(chalk.red(`SSH 😅 服务器连接中断`))
            reject(false)
        })
    })
}
export default{
    connect,
    ssh,
    checkFile,
    deleteFile,
    putFile,
    unZip
}

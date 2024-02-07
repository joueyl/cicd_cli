export interface Config {
    name: string
    value: string
    targetDir:string
    deployDir:string
    serverType:string
    build:string
    server:{
        host:string
        port:number
        username:string
        password:string
    }
}
export interface User{
    runNUM:number,
    runSuccess:number
    runError:number
}
const enum ConfigEnum {
    name = '请输入项目名称(Project name)',
    targetDir = '本地项目打包文件夹(例:C:\\project\\dist)(The folder where the package file is located)',
    deployDir = '远程部署目录(例:/home/www/)(The deployment directory on the server)',
    releaseDir = '远程部署文件夹(The folder where the deployment package is located)',
    ssh = '请输入SSH地址(SSH address)',
    prot='请输入SSH端口(默认22)(SSH Port default is 22)',
    username='请输入服务器用户名(默认root)(User name default is root)',
    password='请输入服务器密码(SSH Password)',
    host = 'host'
} 
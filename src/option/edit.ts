import chalk from "chalk";
import readConfig from "../common/readConfig";
import writeConfig from "../common/writeConfig"
import inquirer from "inquirer"
import readPackage from "../common/readPackage";
import { Config } from "../../types/config";
export default async function edit(name:string,key?:string) {
    const config = readConfig()
    if (!config.length) {
        console.log(chalk.red("scd 🤷‍♂️ 无配置项,请运行scd add去添加一个吧"))
        process.exit(0)
    }
    const currentConfig = readConfig().findIndex((res) => res.name === name)
    if(currentConfig<0){
        console.log(chalk.red(`scd 🥵 ${name}配置不存在`))
        process.exit(0) 
    }
    const res = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: '项目名称(Project name)',
            default: config[currentConfig].name,
            validate: function(value) {
                // 使用正则表达式校验输入只包含英文字符
                if (/^[a-zA-Z0-9]+$/.test(value)) {
                  return true;  // 输入符合要求，只包含英文字符
                }else if(config.find(res=>res.name===value)){
                    return '项目已存在(project already exists)'
                }else{
                    return '请输入英文字符(enter English characters)';  // 输入不符合要求，返回错误信息
                }
              },
        },
        {
            type: 'list',
            name:'type',
            message:'服务器类型(Server type)',
            default:config[currentConfig].serverType,
            choices:['ssh','ftp'],
        },
        {
            type: 'input',
            name: 'host',
            message: '服务器地址(server address)',
            default: config[currentConfig].server.host,
            validate(input, answers) {
                if(!input){
                    return '服务器地址'
                }
                return true
            },
        },
        {
            type: 'input',
            name: 'port',
            message: '服务器端口(默认22)(server Port default is 22)',
            default: config[currentConfig].server.port,
        },
        {
            type:'input',
            name:'username',
            message:'服务器用户名(默认root)(User name default is root)',
            default: config[currentConfig].server.username,
        },
        {
            type:'password',
            name:'password',
            message:'服务器密码(server Password)',
            default: config[currentConfig].server.password,
            validate(input, answers) {
                if(!input){
                    return '请输入服务器密码'
                }
                return true
            }
        },
        {
            type:'input',
            name:'targetDir',
            message:'项目目录(例:C:\\project\\dist)(The folder where the package file is located)',
            validate(input, answers) {
                if(!input){
                    return '项目目录(The folder where the package file is located)'
                }else{
                    if(Object.keys(readPackage(input).scripts).length){
                        return true
                    }
                    return '未找到项目script,请检查输入内容或scripts中是否有命令'
                }
            },
            default: config[currentConfig].targetDir,
            filter(input, answers) {
                return input.replace(/\\/g, '/');
            },
        },
        {
            type:'list',
            name:'build',
            message:'请选择打包命令(build type)',
            default:config[currentConfig].build,
            choices:(answers)=>{
                return Object.keys(readPackage(answers.targetDir).scripts)
            },
        },
        {
            type:'input',
            name:'deployDir',
            message:'远程目录(例:/home/www/)(The deployment directory on the server)',
            validate(input, answers) {
                if(!input){
                    return '远程目录(例:/home/www/)(The deployment directory on the server)'
                }
                return true
            },
            filter(input, answers) {
                return input.replace(/\\/g, '/');
            },
            default: config[currentConfig].deployDir
        }
    ])
    const inputRes:Config = {
        value: res.name,
        server: {
            host: res.host,
            password: res.password,
            username: res.username || 'root',
            port: res.port ? Number(res.port) : 22
        },
        serverType:res.type,
        build:res.build,
        name: res.name,
        targetDir: res.targetDir,
        deployDir: res.deployDir
    }
    config[currentConfig] = inputRes
    writeConfig(config)
}
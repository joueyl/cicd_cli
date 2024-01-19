import inquirer from 'inquirer'
import readConfig from '../common/readConfig';
import writeConfig from '../common/writeConfig';
import tableLog from '../common/table';
import chalk from 'chalk';
/**
 * 添加配置
 */
export default async function add () {
    const config = readConfig()
   const res = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: '请输入项目名称(Project name)',
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
            type: 'input',
            name: 'host',
            message: '请输入SSH地址(SSH address)',
            validate(input, answers) {
                if(!input){
                    return '请输入SSH地址'
                }
                return true
            },
        },
        {
            type: 'input',
            name: 'port',
            message: '请输入SSH端口(默认22)(SSH Port default is 22)',
        },
        {
            type:'input',
            name:'username',
            message:'请输入服务器用户名(默认root)(User name default is root)',
        },
        {
            type:'password',
            name:'password',
            message:'请输入服务器密码(SSH Password)',
            mask: '*',
            validate(input, answers) {
                if(!input){
                    return '请输入服务器密码'
                }
                return true
            }
        },{
            type:'input',
            name:'targetDir',
            message:'本地项目文件夹(例:C:\\project)(The folder where the package file is located)',
            validate(input, answers) {
                if(!input){
                    return '本地项目打包文件夹(The folder where the package file is located)'
                }
                return true
            },
            filter(input, answers) {
                return input.replace(/\\/g, '/');
            },
        },{
            type:'input',
            name:'deployDir',
            message:'远程部署目录(例:/home/www/)(The deployment directory on the server)',
            validate(input, answers) {
                if(!input){
                    return '远程部署目录(例:/home/www/)(The deployment directory on the server)'
                }
                return true
            },
            filter(input, answers) {
                return input.replace(/\\/g, '/');
            },
        },{
            type:'input',
            name:'releaseDir',
            message:'远程部署文件夹(The folder where the deployment package is located)',
        }

    ])
    const inputRes:Config = {
        value: res.name,
        ssh: {
            host: res.host,
            password: res.password,
            username: res.username || 'root',
            port: res.port ? Number(res.port) : 22
        },
        releaseDir: res.releaseDir || res.name,
        name: res.name,
        targetDir: res.targetDir,
        deployDir: res.deployDir
    }
    
    config.push(inputRes)
    writeConfig(config)
    console.log(chalk.green('添加成功'))
    tableLog([inputRes])
}
import inquirer from "inquirer";
import readConfig from "../common/readConfig";
import chalk from "chalk"
export default async function select(name:string) {
    const config = readConfig();
    if(!config.length){
        console.log(chalk.red("scd 🧐 无配置项,请运行scd add去添加一个吧"))
        process.exit(0)
    }
    const projects = config.map((res)=>res.name)
   return inquirer.prompt([{
       type: "list",
       name: "projectName",
       message: "请选择要操作的项目",
       choices: projects,
       default:1
   }])
}
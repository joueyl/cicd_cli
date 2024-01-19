import readConfig from "../common/readConfig";
import tableLog from "../common/table";
import chalk from "chalk";
import run from "./run";
export const list = () => {
    const config = readConfig();
    if (!config.length) {
        console.log(chalk.red("scd 🧐 无配置项,请运行scd add去添加一个吧"))
        process.exit(0)
    }
    tableLog(config);
}
export const listOnly = (name:string) => {
    const config = readConfig();
    if (!config.length) {
        console.log(chalk.red("scd 🧐 无配置项,请运行scd add去添加一个吧"))
        process.exit(1)
    }
    const res = config.filter((res) => res.name === name);
    console.log(res)
    if(!res.length){
        console.log(chalk.red(`scd 🥵 ${name}配置不存在`))
    }else{
        tableLog(res);
    }
}
import chalk from "chalk";
import readConfig from "../common/readConfig";
import writeConfig from "../common/writeConfig";
import flattenObject from "../utils/flattenObject";
import inquirer from "inquirer";
const ConfigEnum:any = {
  name: "请输入项目名称(Project name)",
  targetDir:
    "本地项目打包文件夹(例:C:\\project\\dist)(The folder where the package file is located)",
  deployDir:
    "远程部署目录(例:/home/www/)(The deployment directory on the server)",
  releaseDir:
    "远程部署文件夹(The folder where the deployment package is located)",
  prot: "请输入服务器端口(默认22)(Server Port default is 22)",
  username: "请输入服务器用户名(默认root)(User name default is root)",
  password: "请输入服务器密码(Server Password)",
  serverType: "服务器类型(Server type)",
  host: "服务器地址(Server host)",
};
export default async function editKey(name: string, key: string) {
  const config:any = readConfig();
  const currentConfig = readConfig().findIndex((res) => res.name === name);
  if (currentConfig < 0) {
    console.log(chalk.red(`scd 🥵 ${name}配置不存在`))
    process.exit(0);
  } else {
    const flatt = flattenObject(config[currentConfig]);
    const keyArry = Object.keys(flatt);
    const keyIndex = keyArry.findIndex((res) => {
      return res.split("_").includes(key);
    });
    if (keyIndex < 0) {
      console.log(chalk.red(`scd 🥵 ${key}配置不存在`))
      process.exit(0);
    }
    const keyArr = keyArry[keyIndex].split("_");
    const EnemKey = keyArr[keyArr.length - 1];
    const res = await inquirer.prompt([
      {
        type: keyArr[keyArr.length - 1]=='password'?'password':keyArr[keyArr.length - 1]=='serverType'?'list':'input',
        choices:['ssh','ftp'],
        name: keyArr[keyArr.length - 1],
        message: ConfigEnum[EnemKey],
        default:keyArr.length>1?config[currentConfig][keyArr[0]][keyArr[1]]:config[currentConfig][keyArr[0]],
      },
    ]);
    if(keyArr.length>1){
        config[currentConfig][keyArr[0]][keyArr[1]] = res[keyArr[1]]
    }else{
        config[currentConfig][keyArr[0]] = res[keyArr[0]]
    }
    writeConfig(config);
  }
}

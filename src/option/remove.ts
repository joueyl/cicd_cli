import inquirer from "inquirer";
import readConfig from "../common/readConfig";
import writeConfig from "../common/writeConfig";
import chalk from "chalk";
import tableLog from "../common/table";
export default async function remove(name: string) {
  const config = readConfig();
  if (!config.find((res) => res.name === name)) {
    console.log(chalk.red(`scd 🥵 ${name}配置不存在`))
    return 
  }else{
    tableLog([config.find((res) => res.name === name) as Config]);
  }
  const isDelete = await inquirer.prompt({
    type: "confirm",
    name: "confirm",
    message: `是否确认删除 ${name} ?`,
  });
  if (isDelete.confirm) {
    const res = config.splice(
      config.findIndex((res) => res.name === name),
      1
    );
    writeConfig(config);
    console.log(`已删除 ${name} `);
  }
}

import inquirer from "inquirer";
import readConfig from "../common/readConfig";
import writeConfig from "../common/writeConfig";
import tableLog from "../common/table";
import chalk from "chalk";
import readPackage from "../common/readPackage";
import { resolve } from "path";
/**
 * 添加配置
 */
export default async function add() {
  const packageJson = readPackage(process.cwd());
  //判断package里的scripts命令是否存在
  if (!packageJson) {
    console.log(
      chalk.red("scd 🧐 未找到package.json,请在项目根目录执行此命令")
    );
    process.exit(0);
  } else {
    if (Object.keys(packageJson.scripts).length === 0) {
      console.log(
        chalk.red("scd 🧐 未找到package.json中的scripts项，无法执行此命令")
      );
      process.exit(0);
    }
  }
  const config = readConfig();
  const res = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "请输入项目名称(Project name)",
      validate: function (value) {
        // 使用正则表达式校验输入只包含英文字符
        if (/^[a-zA-Z0-9]+$/.test(value)) {
          if (config.find((res) => res.name === value)) {
            return "项目已存在(project already exists)";
          }
          return true;
        } else {
          return "请输入英文字符(enter English characters)"; // 输入不符合要求，返回错误信息
        }
      },
    },
    {
      type: "list",
      name: "build",
      message: `当前项目找到${
        Object.keys(packageJson.scripts).length
      }个运行命令，请选择要执行的打包命令`,
      choices: Object.keys(packageJson.scripts),
    },
    {
      type: "list",
      name: "type",
      message: "请选择服务器类型(Server type)",
      choices: ["ssh", "ftp"],
    },
    {
      type: "input",
      name: "host",
      message: "请输入服务器地址(Server address)",
      validate(input, answers) {
        if (!input) {
          return "请输入服务器地址";
        }
        return true;
      },
    },
    {
      type: "input",
      name: "port",
      message:
        "请输入服务器端口(SSH默认22,FTP默认21)(Server Port default is 21|22)",
      default: function (answers: { type: string }) {
        if (answers.type == "ssh") {
          return 22;
        }
        return 21;
      },
    },
    {
      type: "input",
      name: "username",
      message: "请输入服务器用户名(默认root)(User name default is root)",
    },
    {
      type: "password",
      name: "password",
      message: "请输入服务器密码(Server Password)",
      mask: "*",
      validate(input, answers) {
        if (!input) {
          return "请输入服务器密码";
        }
        return true;
      },
    },
    {
      type: "input",
      name: "deployDir",
      message:
        "远程部署目录(例:/home/www/project)(The deployment directory on the server)",
      validate(input, answers) {
        if (!input) {
          return "远程部署目录(例:/home/www/project)(The deployment directory on the server)";
        }
        return true;
      },
      filter(input, answers) {
        return input.replace(/\\/g, "/");
      },
    },
  ]);
  const inputRes: Config = {
    value: res.name,
    server: {
      host: res.host,
      password: res.password,
      username: res.username || "root",
      port: res.port ? Number(res.port) : 22,
    },
    serverType: res.type,
    name: res.name,
    targetDir: resolve(process.cwd(), "dist"),
    deployDir: res.deployDir,
    build: res.build,
  };
  config.push(inputRes);
  writeConfig(config);
  console.log(chalk.green("添加成功"));
  tableLog([inputRes]);
}

import chalk from "chalk";
import { NodeSSH } from "node-ssh";
import whitelistFile from "../utils/whitelistFile";
const ssh = new NodeSSH();
function connect(object: Config) {
  return new Promise(async (resolve, reject) => {
    ssh
      .connect(object.server)
      .then((res) => {
        console.log(chalk.green(`${object.name} 😅 服务器连接成功`));
        resolve(res);
      })
      .catch((error) => {
        console.log(chalk.red(`${object.name} 😅 服务器连接失败`));
        process.exit(0);
      });
  });
}
function checkFile(path: string) {
  return new Promise<boolean>((resolve, reject) => {
    ssh
      .execCommand(`ls ${path}`)
      .then((res) => {
        if (res.stderr) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        console.log(chalk.red(`SSH 😅 服务器连接中断`));
      });
  });
}
function deleteFile(path: string, enableWhitelist = false) {
  return new Promise(async(resolve, reject) => {
    if (enableWhitelist) {
      let whiteString = "";
      whitelistFile.forEach((item) => {
        whiteString += `! -name "${item}"`;
      });
      await ssh.execCommand(`cd ${path}`)
      ssh
        .execCommand(`find . -type f -name "*" ${whiteString} -exec rm {} \\;`)
        .then(async(res) => {
          if (res.stderr) {
            resolve(res.stderr);
            process.exit(0);
          } else {
            resolve(true);
            await ssh.execCommand('cd ..')
          }
        });
    } else {
      ssh.execCommand(`rm -rf ${path}`).then((res) => {
        if (res.stderr) {
          resolve(res.stderr);
          process.exit(0);
        } else {
          resolve(true);
        }
      });
    }
  });
}
function putFile(path: string, remotePath: string) {
  return new Promise((resolve, reject) => {
    ssh
      .putFile(path, remotePath + "/dist.zip")
      .then((res) => {
        console.log(chalk.green(`SSH 📂 文件上传成功`));
        resolve(true);
      })
      .catch((error) => {
        console.log(chalk.red(`SSH 🥵 文件上传失败`));
        reject(false);
      });
  });
}
function unZip(targetDir: string) {
  return new Promise<boolean>((resolve, reject) => {
    ssh
      .execCommand(`unzip dist.zip`, { cwd: targetDir })
      .then((res) => {
        console.log(chalk.green(`SSH 📂 文件解压成功`));
        resolve(true);
      })
      .catch((error) => {
        console.log(chalk.red(`SSH 😅 服务器连接中断`));
        reject(false);
      });
  });
}
function mvFile(deployDir:string){
    return new Promise((resolve, reject) => {
        ssh.execCommand(`mv ${deployDir}/dist/* ${deployDir}/`).then((res) => {
            if (res.stderr) {
                resolve(res.stderr);
            }
        })
    })
}
export default {
  connect,
  ssh,
  checkFile,
  deleteFile,
  putFile,
  unZip,
  mvFile
};

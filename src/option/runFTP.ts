import jsftp from "jsftp";
import chalk from "chalk";
import build from "../common/build";
import path from "node:path";
import fs from "node:fs";
let ftp: jsftp;
let config: Config;
export default async function run(object: Config) {
  config = object;
  try {
    console.log(chalk.blue(`${object.name} ⏳ 开始打包`));
    await build(path.resolve(object.targetDir), "npm run build");
    console.log(chalk.green(`${object.name} ✔ 打包完成`));
  } catch (error) {
    console.log(chalk.red(`${object.name} ✘ 打包失败`));
  }
  ftp = new jsftp({
    host: object.server.host,
    port: object.server.port,
    user: object.server.username,
    pass: object.server.password,
  });
  const localDir = path.resolve(config!.targetDir, "./dist");
  const tempRemoteDir = `${config!.deployDir}jouei-temp`; // 上传到临时目录
  const finalRemoteDir = `${config!.deployDir}${config!.releaseDir}`; // 最终的目录名
  ftp.raw("cwd " + object.deployDir, (err, data) => {
    if (data.code !== 250) {
      console.log(chalk.red("ftp 😅 远程目录配置有误"));
      process.exit(0);
    }
    ftp.raw("cwd " + object.releaseDir, (err, data) => {
      if (data.code !== 250) {
        upload(tempRemoteDir, finalRemoteDir, localDir);
      }
    });
  });
}
// 遍历本地文件夹并上传文件
function uploadDir(localPath: string, remotePath: string) {
  fs.readdir(localPath, (err, files) => {
    if (err) {
      console.error("Error reading local directory:", err);
      return;
    }

    files.forEach((file) => {
      const localFilePath = path.join(localPath, file);
      const remoteFilePath = path.join(remotePath, file);

      // 检查是文件还是目录
      fs.stat(localFilePath, (err, stats) => {
        if (stats.isFile()) {
          // 上传文件
          ftp.put(localFilePath, remoteFilePath, (err) => {
            if (err) {
              console.error("Error uploading file:", err);
            } else {
              console.log( `FTP 上传 ${localFilePath} to ${remoteFilePath}`);
            }
          });
        } else if (stats.isDirectory()) {
          // 如果是目录，递归调用
          uploadDir(localFilePath, remoteFilePath);
        }
      });
    });
  });
}

function upload(tempRemoteDir:string, finalRemoteDir:string, localDir:string) {
  return new Promise((resolve, reject) => {
    ftp.raw("mkd", tempRemoteDir, (err) => {
      if (err) {
        reject(false)
        return;
      }

      uploadDir(localDir, tempRemoteDir);

      // 上传完成后重命名文件夹
      ftp.rename(tempRemoteDir, finalRemoteDir, (err) => {
        if (err) {
          reject(false)
        } else {
            resolve(true)
        }
      });
    });
  });
}

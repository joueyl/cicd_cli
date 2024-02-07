import * as ftp from "basic-ftp";
import chalk from "chalk";
import build from "../common/build";
import path from "node:path";
import fs from "node:fs";
import * as progress from "cli-progress";
import whitelistFile from "../utils/whitelistFile";
import { Config } from "../../types/config";
/**
 * 获取文件夹大小
 * @param folderPath 文件夹路径
 */
function getFolderSize(folderPath: string) {
  let totalSize = 0;

  // 同步地读取文件夹内容
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
      // 如果是文件，累加文件大小
      totalSize += stats.size;
    } else if (stats.isDirectory()) {
      // 如果是文件夹，递归地计算文件夹大小
      totalSize += getFolderSize(filePath);
    }
  }

  return totalSize;
}
let config: Config;
const client = new ftp.Client();
let size: number = 0;
let allSize: number = 0;
let bar:progress.SingleBar = new progress.SingleBar(
  {
    format:
      "正在上传 |" +
      chalk.cyan("{bar}") +
      "| {percentage}% || {value}MB/{total}MB",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  },
  progress.Presets.shades_classic
);
client.trackProgress((info) => {
  if (!info.name) {
    size = info.bytesOverall;
  }
  bar.update(Number(((info.bytesOverall - size) / 1024 / 1024).toFixed(2)), {});
});
export default async function run(object: Config) {
  return new Promise<string|boolean>(async (resolve, reject) => {
    config = object;
    try {
      console.log(chalk.blue(`${object.name} ⏳ 开始打包`));
      console.time("打包耗时");
      await build(path.resolve(object.targetDir), `npm run ${object.build}`);
      console.log(chalk.green(`${object.name} ✔ 打包完成`));
      console.timeEnd("打包耗时");
      allSize = getFolderSize(path.resolve(config.targetDir,'dist'));
    } catch (error) {
      console.log(chalk.red(`${object.name} ✘ 打包失败`),error);
    }
    try {
      await client.access({
        host: object.server.host,
        user: object.server.username,
        password: object.server.password,
        port: object.server.port,
      });
    } catch (err) {
      bar.stop();
      console.log(chalk.red(`${object.name} 😅 服务器连接失败`));
      reject(chalk.red(`${object.name} 😅 服务器连接失败`));
      return
    }
    try {
      await client.ensureDir(`${config.deployDir}`);
      await client.send('SITE CHMOD 777'+` ${config.deployDir}`);
      await deleteFilesExcept(client, config.deployDir, whitelistFile,true)
      bar.start(Number((allSize / 1024 / 1024).toFixed(2)), 0);
      await client.ensureDir(`${config.deployDir}`);
      await client.uploadFromDir(path.resolve(config.targetDir,'dist'));
      bar.stop();
      console.log(chalk.green(`${object.name} 🎉 上传成功`));
      console.log(chalk.green(`${object.name} ✨ 部署完成`));
      client.close();
      resolve(true);
    } catch (err) {
      bar.stop();
      console.log(
        chalk.red(`${object.name} 😅 上传失败请检查FTP配置或查看网络连接`, err)
      );
      return
    }
  });
}
async function deleteFilesExcept(client:ftp.Client, dir:string, exceptFile:string[],isRoot=false) {
  try {
      await client.cd(dir); // 切换到指定目录
      const files = await client.list(); // 列出目录下的所有文件和文件夹
      for (const file of files) {
          if (!exceptFile.includes(file.name)) {
              if (file.type ==2) {
                  // 如果是文件夹，则可能需要递归删除（取决于你的需求）
                 await deleteFilesExcept(client, `${dir}/${file.name}`, exceptFile);
              } else {
                  // 删除文件
                  console.log(chalk.red(`删除旧文件: ${file.name}`));
                  await client.cd(dir);
                  await client.remove(file.name);
              }
          }else{
            console.log(`发现白名单文件 ${file.name} 已进行规避`)
          }
      }
      if(!isRoot){
       await client.cdup()
       await client.removeDir(dir)
      }
  } catch (error) {
      process.exit(1)
  }
}

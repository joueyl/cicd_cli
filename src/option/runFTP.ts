import * as ftp from "basic-ftp";
import chalk from "chalk";
import build from "../common/build";
import path from "node:path";
import fs from "node:fs";
import * as progress from 'cli-progress'
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
let bar = new progress.SingleBar({
  format: '正在上传 |' + chalk.cyan('{bar}') + '| {percentage}% || {value}MB/{total}MB',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true
}, progress.Presets.shades_classic);
client.trackProgress((info) => {
  if (!info.name) {

    size = info.bytesOverall;
  }
  bar.update(Number(((info.bytesOverall - size) / 1024 / 1024).toFixed(2)), {
    
  })
});
export default async function run(object: Config) {
  config = object;
  try {
    console.log(chalk.blue(`${object.name} ⏳ 开始打包`));
    await build(path.resolve(object.targetDir), "npm run build");
    console.log(chalk.green(`${object.name} ✔ 打包完成`));
    allSize = getFolderSize(path.resolve(config.targetDir, "./dist"));
    bar.start(Number((allSize/1024/1024).toFixed(2)), 0);
  } catch (error) {
    console.log(chalk.red(`${object.name} ✘ 打包失败`));
  }
  try {
    await client.access({
      host: object.server.host,
      user: object.server.username,
      password: object.server.password,
      port: object.server.port,
    });
  } catch (err) {
    console.log(chalk.red(`${object.name} 😅 服务器连接失败`));
    process.exit(0);
  }
  try {
    await client.ensureDir(`${config.deployDir}${config.releaseDir}`);
    await client.clearWorkingDir();
    await client.uploadFromDir(path.resolve(config.targetDir, "./dist"));
    bar.stop()
    console.log(chalk.green(`${object.name} 🎉 上传成功`));
    console.log(chalk.green(`${object.name} ✨ 部署完成`));
    client.close();

  } catch (err) {
    console.log(chalk.red(`${object.name} 😅 上传失败请检查FTP配置或查看网络连接`,err));
  }
}

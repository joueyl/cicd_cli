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
  ftp.raw("cwd " + object.deployDir, async (err, data) => {
    if (data.code !== 250) {
      console.log(chalk.red("ftp 😅 远程目录配置有误"));
      process.exit(0);
    }
    ftp.raw("cwd " + object.releaseDir, async (err, data) => {
      if (data.code == 250) {
        console.log(chalk.blue(`FTP 🔍 发现旧文件夹 ${object.releaseDir}`));
        console.log(chalk.green(`FTP 📂 删除旧文件夹 ${object.releaseDir}`));
        await clearAndRemoveDirectory(object.deployDir + object.releaseDir);
        console.log(chalk.green(`FTP 📂 正在上传文件`));
        await upload(tempRemoteDir, finalRemoteDir, localDir);
        console.log(chalk.green(`${config.name} 🎉 部署成功`));
        ftp.destroy();
        process.exit(0);
      } else {
        console.log(chalk.green(`FTP 📂 正在上传文件`));
        await upload(tempRemoteDir, finalRemoteDir, localDir);
        console.log(chalk.green(`${config.name} 🎉 部署成功`));
        ftp.destroy();
        process.exit(0);
      }
    });
  });
}
// 遍历本地文件夹并上传文件
async function uploadDir(localPath: string, remotePath: string) {
 return new Promise<void>((resolve, reject) => {
    fs.readdir(localPath, async (err, files) => {
      if (err) {
        console.log(chalk.red(`FTP 🥵 读取文件失败${localPath}`), err);
        reject();
        return;
      }
     for (let i = 0; i < files.length; i++) {
        const localFilePath = path.join(localPath, files[i]);
        const remoteFilePath = path.join(remotePath, files[i]);
        console.log(files[i]);
        // 检查是文件还是目录
        await new Promise<void>((resolve, reject) => {
          fs.stat(localFilePath, async (err, stats) => {
            console.log(stats.isFile())
            if (stats.isFile()) {
              // 上传文件
             await new Promise<void>((resolve, reject) => {
              ftp.destroy();
                ftp.put(localFilePath, remoteFilePath.replace(/\\/g, '/'), (err) => {
                if (err) {
                  console.log(
                    chalk.red(
                      `FTP 🥵 上传 ${localFilePath} 到 ${remoteFilePath.replace(/\\/g, '/')} 失败,请检查FTP配置或权限`
                    ),
                    err
                  );
                  ftp.destroy();
                  process.exit(0);
                } else {
                  console.log(
                    chalk.green(
                      `FTP ✔ 上传 ${localFilePath} 到 ${remoteFilePath}成功`
                    )
                  );
                  resolve();
                }
              });
              })
              resolve()
            } else if (stats.isDirectory()) {
             await new Promise<void>((resolve, reject) => {
                // 递归创建目录
                ftp.raw(
                  "mkd",
                  remoteFilePath.replace(/\\/g, '/'),
                  (err) => {
                    if (err) {
                      console.log(
                        chalk.red(
                          `FTP 🥵 创建文件夹 ${remoteFilePath} 失败,请检查FTP配置或权限`
                        ,err)
                      )
                      reject()
                    }else{
                      console.log(chalk.green(`FTP 📂 创建文件夹 ${remoteFilePath} 成功`))
                      resolve()
                    }
                  }
                )
              })
              // 如果是目录，递归调用
              await uploadDir(localFilePath, remoteFilePath);
              resolve();
            }
          });
        })
      };
      resolve();
    });
  });
}

async function upload(
  tempRemoteDir: string,
  finalRemoteDir: string,
  localDir: string
) {
  return new Promise((resolve, reject) => {
    ftp.raw("mkd", tempRemoteDir, async (err) => {
      if (err) {
        reject(false);
        return;
      }
      console.log(chalk.green(`FTP 📂 创建临时文件夹成功${tempRemoteDir}`));
     await uploadDir(localDir, tempRemoteDir);

      // 上传完成后重命名文件夹
      ftp.rename(tempRemoteDir, finalRemoteDir, (err) => {
        if (err) {
          console.log(chalk.red(`FTP 🥵 重命名文件夹失败`), err);
          ftp.destroy();
          process.exit(0);
        } else {
          console.log(
            chalk.green(`FTP ✔ 上传文件夹成功并重命名${finalRemoteDir}`)
          );
          resolve(true);
        }
      });
    });
  });
}
async function clearAndRemoveDirectory(dirPath: string) {
  return new Promise<void>((resolve, reject) => {
    ftp.ls(dirPath, async (err, files: any) => {
      if (err) {
        console.error(`Failed to list files in directory: ${dirPath}`, err);
        reject();
        return;
      }
      let totalFiles: any = files.length;
      if (totalFiles === 0) {
        // 如果文件夹为空，直接删除文件夹
        await removeDirectory(dirPath);
        resolve()
      } else {
        // 否则，先删除文件夹内的所有文件和子文件夹
        files.forEach(async (file: { name: any; type: number }) => {
          const filePath = `${dirPath}/${file.name}`;
          if (file.type === 0) {
            // Type 1 is a file
            ftp.raw("dele", filePath, async (err) => {
              if (err) {
                console.log(
                  `FTP 删除${chalk.red(filePath)}失败请检查FTP权限或配置`,
                  err
                );
                reject()
              } else {
                console.log(chalk.green(`FTP ✔ 删除 ${filePath}成功`));
                resolve();
                if (--totalFiles === 0) {
                  // 所有文件都被删除后，删除文件夹本身
                  await removeDirectory(dirPath);
                  resolve();
                }
              }
            });
          } else {
            // 如果是子文件夹，递归地清空和删除
            await clearAndRemoveDirectory(filePath);
            if (--totalFiles === 0) {
              // 所有内容都被删除后，删除文件夹本身
              await removeDirectory(dirPath);
              resolve();
            }
          }
        });
      }
    });
  });
}
// 删除文件夹
async function removeDirectory(dirPath: string) {
  return new Promise<void>((resolve, reject) => {
    ftp.raw("rmd", dirPath, (err) => {
      if (err) {
        console.log(
          `FTP 删除 ${chalk.red(dirPath)}失败请检查FTP权限或配置`,
          err
        );
        reject();
      } else {
        resolve();
        console.log(chalk.green(`FTP ✔ 删除 ${dirPath}成功`));
      }
    });
  });
}

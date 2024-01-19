#!/usr/bin/env node

// src/index.ts
import { program } from "commander";

// src/common/readConfig.ts
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
function readConfig() {
  const current = resolve(dirname(fileURLToPath(import.meta.url)), "config.json");
  return JSON.parse(fs.readFileSync(current, { encoding: "utf-8" }));
}

// src/option/add.ts
import inquirer from "inquirer";

// src/common/writeConfig.ts
import fs2 from "node:fs";
import { fileURLToPath as fileURLToPath2 } from "node:url";
import { dirname as dirname2, resolve as resolve2 } from "node:path";
function readConfig2(config2) {
  const current = resolve2(dirname2(fileURLToPath2(import.meta.url)), "config.json");
  fs2.writeFileSync(current, JSON.stringify(config2));
}

// src/common/table.ts
import Table from "cli-table3";
function tableLog(data) {
  const table = new Table({
    chars: {
      top: "\u2550",
      "top-mid": "\u2564",
      "top-left": "\u2554",
      "top-right": "\u2557",
      bottom: "\u2550",
      "bottom-mid": "\u2567",
      "bottom-left": "\u255A",
      "bottom-right": "\u255D",
      left: "\u2551",
      "left-mid": "\u255F",
      mid: "\u2500",
      "mid-mid": "\u253C",
      right: "\u2551",
      "right-mid": "\u2562",
      middle: "\u2502"
    },
    style: {
      "padding-left": 0,
      "padding-right": 0
    },
    colWidths: [15, 15, 15, 15, 15, 15, 15, 15, 15],
    wordWrap: true
  });
  table.push(
    [{ content: "\u9879\u76EE\u4FE1\u606F", colSpan: 2, hAlign: "center" }, { content: "\u670D\u52A1\u5668\u4FE1\u606F", colSpan: 5, hAlign: "center" }, { content: "\u9879\u76EE\u8BE6\u7EC6\u4FE1\u606F", colSpan: 3, hAlign: "center" }],
    [{ content: "\u9879\u76EE\u540D\u79F0", hAlign: "center" }, { content: "value", hAlign: "center" }, { content: "\u670D\u52A1\u5668\u5730\u5740", hAlign: "center" }, { content: "\u670D\u52A1\u5668\u7AEF\u53E3", hAlign: "center" }, { content: "\u670D\u52A1\u5668\u7528\u6237\u540D", hAlign: "center" }, { content: "\u670D\u52A1\u5668\u5BC6\u7801", hAlign: "center" }, { content: "\u670D\u52A1\u5668\u7C7B\u578B", hAlign: "center" }, { content: "\u6253\u5305\u6587\u4EF6\u5939", hAlign: "center" }, { content: "\u8FDC\u7A0B\u76EE\u5F55", hAlign: "center" }, { content: "\u8FDC\u7A0B\u6587\u4EF6\u5939", hAlign: "center" }]
  );
  table.push(
    ...data.map((item) => [
      { content: item.name, hAlign: "center" },
      { content: item.value, hAlign: "center" },
      { content: item.server.host, hAlign: "center" },
      { content: item.server.port, hAlign: "center" },
      { content: item.server.username, hAlign: "center" },
      { content: "********", hAlign: "center" },
      { content: item.serverType, hAlign: "center" },
      { content: item.targetDir, hAlign: "center" },
      { content: item.deployDir, hAlign: "center" },
      { content: item.releaseDir, hAlign: "center" }
    ])
  );
  console.log(table.toString());
}

// src/option/add.ts
import chalk from "chalk";
async function add() {
  const config2 = readConfig();
  const res = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "\u8BF7\u8F93\u5165\u9879\u76EE\u540D\u79F0(Project name)",
      validate: function(value) {
        if (/^[a-zA-Z0-9]+$/.test(value)) {
          return true;
        } else if (config2.find((res2) => res2.name === value)) {
          return "\u9879\u76EE\u5DF2\u5B58\u5728(project already exists)";
        } else {
          return "\u8BF7\u8F93\u5165\u82F1\u6587\u5B57\u7B26(enter English characters)";
        }
      }
    },
    {
      type: "list",
      name: "type",
      message: "\u8BF7\u9009\u62E9\u670D\u52A1\u5668\u7C7B\u578B(Server type)",
      choices: ["ssh", "ftp"]
    },
    {
      type: "input",
      name: "host",
      message: "\u8BF7\u8F93\u5165\u670D\u52A1\u5668\u5730\u5740(Server address)",
      validate(input, answers) {
        if (!input) {
          return "\u8BF7\u8F93\u5165\u670D\u52A1\u5668\u5730\u5740";
        }
        return true;
      }
    },
    {
      type: "input",
      name: "port",
      message: "\u8BF7\u8F93\u5165\u670D\u52A1\u5668\u7AEF\u53E3(SSH\u9ED8\u8BA422,FTP\u9ED8\u8BA421)(Server Port default is 21|22)",
      default: function(answers) {
        if (answers.type == "ssh") {
          return 22;
        }
        return 21;
      }
    },
    {
      type: "input",
      name: "username",
      message: "\u8BF7\u8F93\u5165\u670D\u52A1\u5668\u7528\u6237\u540D(\u9ED8\u8BA4root)(User name default is root)"
    },
    {
      type: "password",
      name: "password",
      message: "\u8BF7\u8F93\u5165\u670D\u52A1\u5668\u5BC6\u7801(Server Password)",
      mask: "*",
      validate(input, answers) {
        if (!input) {
          return "\u8BF7\u8F93\u5165\u670D\u52A1\u5668\u5BC6\u7801";
        }
        return true;
      }
    },
    {
      type: "input",
      name: "targetDir",
      message: "\u672C\u5730\u9879\u76EE\u6587\u4EF6\u5939(\u4F8B:C:\\project)(The folder where the package file is located)",
      validate(input, answers) {
        if (!input) {
          return "\u672C\u5730\u9879\u76EE\u6253\u5305\u6587\u4EF6\u5939(The folder where the package file is located)";
        }
        return true;
      },
      filter(input, answers) {
        return input.replace(/\\/g, "/");
      }
    },
    {
      type: "input",
      name: "deployDir",
      message: "\u8FDC\u7A0B\u90E8\u7F72\u76EE\u5F55(\u4F8B:/home/www/)(The deployment directory on the server)",
      validate(input, answers) {
        if (!input) {
          return "\u8FDC\u7A0B\u90E8\u7F72\u76EE\u5F55(\u4F8B:/home/www/)(The deployment directory on the server)";
        }
        return true;
      },
      filter(input, answers) {
        return input.replace(/\\/g, "/");
      }
    },
    {
      type: "input",
      name: "releaseDir",
      message: "\u8FDC\u7A0B\u90E8\u7F72\u6587\u4EF6\u5939(The folder where the deployment package is located)"
    }
  ]);
  const inputRes = {
    value: res.name,
    server: {
      host: res.host,
      password: res.password,
      username: res.username || "root",
      port: res.port ? Number(res.port) : 22
    },
    serverType: res.type,
    releaseDir: res.releaseDir || res.name,
    name: res.name,
    targetDir: res.targetDir,
    deployDir: res.deployDir
  };
  config2.push(inputRes);
  readConfig2(config2);
  console.log(chalk.green("\u6DFB\u52A0\u6210\u529F"));
  tableLog([inputRes]);
}

// src/option/remove.ts
import inquirer2 from "inquirer";
import chalk2 from "chalk";
async function remove(name) {
  const config2 = readConfig();
  if (!config2.find((res) => res.name === name)) {
    console.log(chalk2.red(`scd \u{1F975} ${name}\u914D\u7F6E\u4E0D\u5B58\u5728`));
    return;
  } else {
    tableLog([config2.find((res) => res.name === name)]);
  }
  const isDelete = await inquirer2.prompt({
    type: "confirm",
    name: "confirm",
    message: `\u662F\u5426\u786E\u8BA4\u5220\u9664 ${name} ?`
  });
  if (isDelete.confirm) {
    const res = config2.splice(
      config2.findIndex((res2) => res2.name === name),
      1
    );
    readConfig2(config2);
    console.log(`\u5DF2\u5220\u9664 ${name} `);
  }
}

// src/option/list.ts
import chalk3 from "chalk";
var list = () => {
  const config2 = readConfig();
  if (!config2.length) {
    console.log(chalk3.red("scd \u{1F9D0} \u65E0\u914D\u7F6E\u9879,\u8BF7\u8FD0\u884Cscd add\u53BB\u6DFB\u52A0\u4E00\u4E2A\u5427"));
    process.exit(0);
  }
  tableLog(config2);
};
var listOnly = (name) => {
  const config2 = readConfig();
  if (!config2.length) {
    console.log(chalk3.red("scd \u{1F9D0} \u65E0\u914D\u7F6E\u9879,\u8BF7\u8FD0\u884Cscd add\u53BB\u6DFB\u52A0\u4E00\u4E2A\u5427"));
    process.exit(1);
  }
  const res = config2.filter((res2) => res2.name === name);
  console.log(res);
  if (!res.length) {
    console.log(chalk3.red(`scd \u{1F975} ${name}\u914D\u7F6E\u4E0D\u5B58\u5728`));
  } else {
    tableLog(res);
  }
};

// src/index.ts
import chalk11 from "chalk";

// src/common/build.ts
import { exec } from "child_process";
function build(path4, command) {
  return new Promise((resolve3, reject) => {
    exec(command, {
      cwd: path4
    }).on("exit", resolve3).on("error", reject);
  });
}

// src/option/runSSH.ts
import path2 from "node:path";
import chalk6 from "chalk";

// src/common/FileProcessing.ts
import archiver from "archiver";
import fs3 from "node:fs";
import path from "node:path";
import chalk4 from "chalk";
function zipFile(localPath, releasePath) {
  console.log(chalk4.blue("ZIP \u23F3 \u6B63\u5728\u538B\u7F29\u6587\u4EF6..."));
  return new Promise((resolve3, reject) => {
    const output = fs3.createWriteStream(path.resolve(localPath, "dist.zip"));
    const archive = archiver("zip", {
      zlib: { level: 9 }
      // Sets the compression level.
    });
    archive.pipe(output);
    archive.directory(path.resolve(localPath, "dist"), releasePath);
    archive.finalize();
    output.on("close", () => {
      chalk4.green("ZIP \u538B\u7F29\u5B8C\u6210");
      chalk4.green(console.log(`${chalk4.green("SAVE \u{1F4BE} " + (archive.pointer() / 1024 / 1024).toFixed(2) + "MB")}\u5B57\u8282\u7684\u6570\u636E\u5DF2\u88AB\u5199\u5165\uFF1A${chalk4.blue(localPath)}`));
      resolve3();
    });
    output.on("error", reject);
  });
}

// src/common/ssh.ts
import chalk5 from "chalk";
import { NodeSSH } from "node-ssh";
var ssh = new NodeSSH();
function connect(object) {
  return new Promise(async (resolve3, reject) => {
    ssh.connect(object.ssh).then((res) => {
      console.log(chalk5.green(`${object.name} \u{1F605} \u670D\u52A1\u5668\u8FDE\u63A5\u6210\u529F`));
      resolve3(res);
    }).catch((error) => {
      console.log(chalk5.red(`${object.name} \u{1F605} \u670D\u52A1\u5668\u8FDE\u63A5\u5931\u8D25`));
      process.exit(0);
    });
  });
}
function checkFile(path4) {
  return new Promise((resolve3, reject) => {
    ssh.execCommand(`ls ${path4}`).then((res) => {
      if (res.stderr) {
        resolve3(true);
      } else {
        resolve3(false);
      }
    }).catch((error) => {
      console.log(chalk5.red(`SSH \u{1F605} \u670D\u52A1\u5668\u8FDE\u63A5\u4E2D\u65AD`));
    });
  });
}
function deleteFile(path4) {
  return new Promise((resolve3, reject) => {
    ssh.execCommand(`rm -rf ${path4}`).then((res) => {
      if (res.stderr) {
        resolve3(res.stderr);
        process.exit(0);
      } else {
        resolve3(true);
      }
    });
  });
}
function putFile(path4, remotePath) {
  return new Promise((resolve3, reject) => {
    ssh.putFile(path4, remotePath + "/dist.zip").then((res) => {
      console.log(chalk5.green(`SSH \u{1F4C2} \u6587\u4EF6\u4E0A\u4F20\u6210\u529F`));
      resolve3(true);
    }).catch((error) => {
      console.log(chalk5.red(`SSH \u{1F975} \u6587\u4EF6\u4E0A\u4F20\u5931\u8D25`));
      reject(false);
    });
  });
}
function unZip(targetDir, releaseDir) {
  return new Promise((resolve3, reject) => {
    ssh.execCommand(`unzip dist.zip`, { cwd: targetDir }).then((res) => {
      console.log(chalk5.green(`SSH \u{1F4C2} \u6587\u4EF6\u89E3\u538B\u6210\u529F`));
      resolve3(true);
    }).catch((error) => {
      console.log(chalk5.red(`SSH \u{1F605} \u670D\u52A1\u5668\u8FDE\u63A5\u4E2D\u65AD`));
      reject(false);
    });
  });
}
var ssh_default = {
  connect,
  ssh,
  checkFile,
  deleteFile,
  putFile,
  unZip
};

// src/option/runSSH.ts
import fs4 from "node:fs";
async function run(object) {
  try {
    console.log(chalk6.blue(`${object.name} \u23F3 \u5F00\u59CB\u6253\u5305`));
    await build(path2.resolve(object.targetDir), "npm run build");
    console.log(chalk6.green(`${object.name} \u2714 \u6253\u5305\u5B8C\u6210`));
  } catch (error) {
    console.log(chalk6.red(`${object.name} \u2718 \u6253\u5305\u5931\u8D25`));
  }
  await zipFile(object.targetDir, object.releaseDir);
  await ssh_default.connect(object);
  const isExist = await ssh_default.checkFile(object.deployDir + "/dist.zip");
  if (!isExist) {
    await ssh_default.deleteFile(object.deployDir + "/dist");
  }
  await ssh_default.putFile(path2.resolve(object.targetDir, "./dist.zip"), object.deployDir);
  const isExistProject = await ssh_default.checkFile(object.deployDir + object.releaseDir);
  await ssh_default.deleteFile(object.deployDir + object.releaseDir);
  const isUnzip = await ssh_default.unZip(object.deployDir, object.releaseDir);
  if (isUnzip) {
    console.log(chalk6.green(`${object.name} \u2728 \u90E8\u7F72\u5B8C\u6210`));
  }
  await fs4.unlinkSync(path2.resolve(object.targetDir, "./dist.zip"));
  const isDelete = await ssh_default.deleteFile(object.deployDir + "dist.zip");
  if (isDelete) {
    console.log(chalk6.green(`${object.name} \u2728 \u4E34\u65F6\u6587\u4EF6\u6E05\u9664\u6210\u529F`));
  }
  ssh_default.ssh.dispose();
}

// src/option/runFTP.ts
import jsftp from "jsftp";
import chalk7 from "chalk";
import path3 from "node:path";
import fs5 from "node:fs";
var ftp;
var config;
async function run2(object) {
  config = object;
  try {
    console.log(chalk7.blue(`${object.name} \u23F3 \u5F00\u59CB\u6253\u5305`));
    await build(path3.resolve(object.targetDir), "npm run build");
    console.log(chalk7.green(`${object.name} \u2714 \u6253\u5305\u5B8C\u6210`));
  } catch (error) {
    console.log(chalk7.red(`${object.name} \u2718 \u6253\u5305\u5931\u8D25`));
  }
  ftp = new jsftp({
    host: object.server.host,
    port: object.server.port,
    user: object.server.username,
    pass: object.server.password
  });
  const localDir = path3.resolve(config.targetDir, "./dist");
  const tempRemoteDir = `${config.deployDir}jouei-temp`;
  const finalRemoteDir = `${config.deployDir}${config.releaseDir}`;
  ftp.raw("cwd " + object.deployDir, (err, data) => {
    if (data.code !== 250) {
      console.log(chalk7.red("ftp \u{1F605} \u8FDC\u7A0B\u76EE\u5F55\u914D\u7F6E\u6709\u8BEF"));
      process.exit(0);
    }
    ftp.raw("cwd " + object.releaseDir, (err2, data2) => {
      if (data2.code !== 250) {
        upload(tempRemoteDir, finalRemoteDir, localDir);
      }
    });
  });
}
function uploadDir(localPath, remotePath) {
  fs5.readdir(localPath, (err, files) => {
    if (err) {
      console.error("Error reading local directory:", err);
      return;
    }
    files.forEach((file) => {
      const localFilePath = path3.join(localPath, file);
      const remoteFilePath = path3.join(remotePath, file);
      fs5.stat(localFilePath, (err2, stats) => {
        if (stats.isFile()) {
          ftp.put(localFilePath, remoteFilePath, (err3) => {
            if (err3) {
              console.error("Error uploading file:", err3);
            } else {
              console.log(`FTP \u4E0A\u4F20 ${localFilePath} to ${remoteFilePath}`);
            }
          });
        } else if (stats.isDirectory()) {
          uploadDir(localFilePath, remoteFilePath);
        }
      });
    });
  });
}
function upload(tempRemoteDir, finalRemoteDir, localDir) {
  return new Promise((resolve3, reject) => {
    ftp.raw("mkd", tempRemoteDir, (err) => {
      if (err) {
        reject(false);
        return;
      }
      uploadDir(localDir, tempRemoteDir);
      ftp.rename(tempRemoteDir, finalRemoteDir, (err2) => {
        if (err2) {
          reject(false);
        } else {
          resolve3(true);
        }
      });
    });
  });
}

// src/common/selectRun.ts
function selectRun(config2) {
  switch (config2.serverType) {
    case "ssh":
      run(config2);
      break;
    case "ftp":
      run2(config2);
      break;
  }
}

// src/option/select.ts
import inquirer3 from "inquirer";
import chalk8 from "chalk";
async function select(name) {
  const config2 = readConfig();
  if (!config2.length) {
    console.log(chalk8.red("scd \u{1F9D0} \u65E0\u914D\u7F6E\u9879,\u8BF7\u8FD0\u884Cscd add\u53BB\u6DFB\u52A0\u4E00\u4E2A\u5427"));
    process.exit(0);
  }
  const projects = config2.map((res) => res.name);
  return inquirer3.prompt([{
    type: "list",
    name: "projectName",
    message: "\u8BF7\u9009\u62E9\u8981\u64CD\u4F5C\u7684\u9879\u76EE",
    choices: projects,
    default: 1
  }]);
}

// src/option/edit.ts
import chalk9 from "chalk";
import inquirer4 from "inquirer";
async function edit(name, key) {
  const config2 = readConfig();
  if (!config2.length) {
    console.log(chalk9.red("scd \u{1F937}\u200D\u2642\uFE0F \u65E0\u914D\u7F6E\u9879,\u8BF7\u8FD0\u884Cscd add\u53BB\u6DFB\u52A0\u4E00\u4E2A\u5427"));
    process.exit(0);
  }
  const currentConfig = readConfig().findIndex((res2) => res2.name === name);
  if (currentConfig < 0) {
    console.log(chalk9.red(`scd \u{1F975} ${name}\u914D\u7F6E\u4E0D\u5B58\u5728`));
    process.exit(0);
  }
  const res = await inquirer4.prompt([
    {
      type: "input",
      name: "name",
      message: "\u8BF7\u8F93\u5165\u9879\u76EE\u540D\u79F0(Project name)",
      default: config2[currentConfig].name,
      validate: function(value) {
        if (/^[a-zA-Z0-9]+$/.test(value)) {
          return true;
        } else if (config2.find((res2) => res2.name === value)) {
          return "\u9879\u76EE\u5DF2\u5B58\u5728(project already exists)";
        } else {
          return "\u8BF7\u8F93\u5165\u82F1\u6587\u5B57\u7B26(enter English characters)";
        }
      }
    },
    {
      type: "list",
      name: "type",
      message: "\u8BF7\u9009\u62E9\u670D\u52A1\u5668\u7C7B\u578B(Server type)",
      choices: ["ssh", "ftp"]
    },
    {
      type: "input",
      name: "host",
      message: "\u8BF7\u8F93\u5165SSH\u5730\u5740(SSH address)",
      default: config2[currentConfig].server.host,
      validate(input, answers) {
        if (!input) {
          return "\u8BF7\u8F93\u5165SSH\u5730\u5740";
        }
        return true;
      }
    },
    {
      type: "input",
      name: "port",
      message: "\u8BF7\u8F93\u5165SSH\u7AEF\u53E3(\u9ED8\u8BA422)(SSH Port default is 22)",
      default: config2[currentConfig].server.port
    },
    {
      type: "input",
      name: "username",
      message: "\u8BF7\u8F93\u5165\u670D\u52A1\u5668\u7528\u6237\u540D(\u9ED8\u8BA4root)(User name default is root)",
      default: config2[currentConfig].server.username
    },
    {
      type: "password",
      name: "password",
      message: "\u8BF7\u8F93\u5165\u670D\u52A1\u5668\u5BC6\u7801(SSH Password)",
      default: config2[currentConfig].server.password,
      validate(input, answers) {
        if (!input) {
          return "\u8BF7\u8F93\u5165\u670D\u52A1\u5668\u5BC6\u7801";
        }
        return true;
      }
    },
    {
      type: "input",
      name: "targetDir",
      message: "\u672C\u5730\u9879\u76EE\u6253\u5305\u6587\u4EF6\u5939(\u4F8B:C:\\project\\dist)(The folder where the package file is located)",
      validate(input, answers) {
        if (!input) {
          return "\u672C\u5730\u9879\u76EE\u6253\u5305\u6587\u4EF6\u5939(The folder where the package file is located)";
        }
        return true;
      },
      default: config2[currentConfig].targetDir,
      filter(input, answers) {
        return input.replace(/\\/g, "/");
      }
    },
    {
      type: "input",
      name: "deployDir",
      message: "\u8FDC\u7A0B\u90E8\u7F72\u76EE\u5F55(\u4F8B:/home/www/)(The deployment directory on the server)",
      validate(input, answers) {
        if (!input) {
          return "\u8FDC\u7A0B\u90E8\u7F72\u76EE\u5F55(\u4F8B:/home/www/)(The deployment directory on the server)";
        }
        return true;
      },
      filter(input, answers) {
        return input.replace(/\\/g, "/");
      },
      default: config2[currentConfig].deployDir
    },
    {
      type: "input",
      name: "releaseDir",
      default: config2[currentConfig].releaseDir,
      message: "\u8FDC\u7A0B\u90E8\u7F72\u6587\u4EF6\u5939(The folder where the deployment package is located)"
    }
  ]);
  const inputRes = {
    value: res.name,
    server: {
      host: res.host,
      password: res.password,
      username: res.username || "root",
      port: res.port ? Number(res.port) : 22
    },
    serverType: res.type,
    releaseDir: res.releaseDir || res.name,
    name: res.name,
    targetDir: res.targetDir,
    deployDir: res.deployDir
  };
  config2[currentConfig] = inputRes;
  readConfig2(config2);
}

// src/option/editKey.ts
import chalk10 from "chalk";

// src/utils/flattenObject.ts
function flattenObject(obj, parentKey = "", res = {}) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let propName = parentKey ? parentKey + "_" + key : key;
      if (typeof obj[key] === "object" && obj[key] !== null) {
        flattenObject(obj[key], propName, res);
      } else {
        res[propName] = obj[key];
      }
    }
  }
  return res;
}

// src/option/editKey.ts
import inquirer5 from "inquirer";
var ConfigEnum = {
  name: "\u8BF7\u8F93\u5165\u9879\u76EE\u540D\u79F0(Project name)",
  targetDir: "\u672C\u5730\u9879\u76EE\u6253\u5305\u6587\u4EF6\u5939(\u4F8B:C:\\project\\dist)(The folder where the package file is located)",
  deployDir: "\u8FDC\u7A0B\u90E8\u7F72\u76EE\u5F55(\u4F8B:/home/www/)(The deployment directory on the server)",
  releaseDir: "\u8FDC\u7A0B\u90E8\u7F72\u6587\u4EF6\u5939(The folder where the deployment package is located)",
  prot: "\u8BF7\u8F93\u5165\u670D\u52A1\u5668\u7AEF\u53E3(\u9ED8\u8BA422)(Server Port default is 22)",
  username: "\u8BF7\u8F93\u5165\u670D\u52A1\u5668\u7528\u6237\u540D(\u9ED8\u8BA4root)(User name default is root)",
  password: "\u8BF7\u8F93\u5165\u670D\u52A1\u5668\u5BC6\u7801(Server Password)",
  serverType: "\u670D\u52A1\u5668\u7C7B\u578B(Server type)",
  host: "\u670D\u52A1\u5668\u5730\u5740(Server host)"
};
async function editKey(name, key) {
  const config2 = readConfig();
  const currentConfig = readConfig().findIndex((res) => res.name === name);
  if (currentConfig < 0) {
    console.log(chalk10.red(`scd \u{1F975} ${name}\u914D\u7F6E\u4E0D\u5B58\u5728`));
    process.exit(0);
  } else {
    const flatt = flattenObject(config2[currentConfig]);
    const keyArry = Object.keys(flatt);
    const keyIndex = keyArry.findIndex((res2) => {
      return res2.split("_").includes(key);
    });
    if (keyIndex < 0) {
      console.log(chalk10.red(`scd \u{1F975} ${key}\u914D\u7F6E\u4E0D\u5B58\u5728`));
      process.exit(0);
    }
    const keyArr = keyArry[keyIndex].split("_");
    const EnemKey = keyArr[keyArr.length - 1];
    const res = await inquirer5.prompt([
      {
        type: keyArr[keyArr.length - 1] == "password" ? "password" : keyArr[keyArr.length - 1] == "serverType" ? "list" : "input",
        choices: ["ssh", "ftp"],
        name: keyArr[keyArr.length - 1],
        message: ConfigEnum[EnemKey],
        default: keyArr.length > 1 ? config2[currentConfig][keyArr[0]][keyArr[1]] : config2[currentConfig][keyArr[0]]
      }
    ]);
    if (keyArr.length > 1) {
      config2[currentConfig][keyArr[0]][keyArr[1]] = res[keyArr[1]];
    } else {
      config2[currentConfig][keyArr[0]] = res[keyArr[0]];
    }
    readConfig2(config2);
  }
}

// src/index.ts
program.command("add").action(async () => {
  await add();
}).description("\u6DFB\u52A0\u4E00\u4E2A\u9879\u76EE").alias("a");
program.command("remove [name]").action(async (name) => {
  if (!name) {
    const res = await select(name);
    await remove(res.projectName);
  } else {
    await remove(name);
  }
}).description("\u5220\u9664\u4E00\u4E2A\u9879\u76EE").alias("rm");
program.command("list [name]").action(async (name) => {
  if (name) {
    console.log(name, "listOnly");
    await listOnly(name);
  } else {
    await list();
  }
}).description("\u67E5\u770B\u4E00\u4E2A\u6216\u6240\u6709\u9879\u76EE").alias("ls");
program.command("run [name]").action(async (name) => {
  if (!name) {
    const res2 = await select(name);
    name = res2.projectName;
  }
  const config2 = readConfig();
  if (!config2.length) {
    console.log(chalk11.red("scd \u{1F9D0} \u65E0\u914D\u7F6E\u9879,\u8BF7\u8FD0\u884Cscd add\u53BB\u6DFB\u52A0\u4E00\u4E2A\u5427"));
    process.exit(0);
  }
  const res = config2.find((res2) => res2.name === name);
  if (!res) {
    console.log(chalk11.red(`scd \u{1F975} ${name}\u914D\u7F6E\u4E0D\u5B58\u5728`));
    process.exit(0);
  } else {
    await selectRun(res);
  }
}).description("\u8FD0\u884C\u9879\u76EE\u6216\u6307\u5B9A\u4E00\u4E2A\u9879\u76EE").alias("r");
program.command("edit [name] [key]").action(async (name, key) => {
  if (!key && !name) {
    const res = await select(name);
    name = res.projectName;
    await edit(name);
    process.exit(0);
  }
  if (key && name) {
    await editKey(name, key);
  } else {
    await edit(name, key);
  }
}).description("\u7F16\u8F91\u4E00\u4E2A\u9879\u76EE\u6216\u9879\u76EE\u914D\u7F6E").alias("e");
program.command("help").action(() => {
  program.outputHelp();
}).description("\u67E5\u770B\u5E2E\u52A9").alias("h");
program.parse(process.argv);

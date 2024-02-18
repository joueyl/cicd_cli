#!/usr/bin/env node
import envPaths from "env-paths";
import fs from "node:fs";
import path from "node:path";
//判断config.json是否存在不存在则添加
const user = {
  runNUM: 0,
  runSuccess: 0,
  runError: 0,
};
//检查配置是否存在
checkConfig(envPaths("scd").config, "config.json", []);
//检查运行记录是否存在
checkConfig(envPaths("scd").config, "user.json", user);
//检查日志是否存在
checkConfig(envPaths("scd").config, "log.txt");
function checkConfig(_path: string, file: string, config?: any) {
  if (!config) {
    fs.writeFileSync(path.resolve(_path, file), "");
  }
  if (!fs.existsSync(_path)) {
    fs.mkdirSync(_path, { recursive: true });
    fs.writeFileSync(path.resolve(_path, file), JSON.stringify(config));
  } else {
    if (!fs.existsSync(path.resolve(_path, file))) {
      fs.writeFileSync(path.resolve(_path, file), JSON.stringify(config));
    }
  }
}

import http from "node:http";
import readConfig from "../common/readConfig";
import querystring from "node:querystring";
import readPackage from "../common/readPackage";
import writeConfig from '../common/writeConfig'
import { readUser } from "../common/readUser";
import readLog from "../common/readLog";
export default async function (
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  const query = querystring.parse(req.url?.split("?")[1] || "");
  const configs = readConfig();
  let data = "";
  switch (req.url?.split("?")[0]) {
    case "/api/config":
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          code: 1,
          data: readConfig(),
          msg: "获取成功",
        })
      );
      break;
    case "/api/getBuildCommand":
      res.writeHead(200, { "Content-Type": "application/json" });
      if (query.path) {
        const packageJson = readPackage(query.path as string);
        if (packageJson) {
          res.end(
            JSON.stringify({
              code: 1,
              data: packageJson.scripts,
              msg: "获取成功",
            })
          );
        } else {
          res.end(JSON.stringify({ code: 0, message: "未找到package.json" }));
        }
      } else {
        res.end(JSON.stringify({ code: 0, msg: "请先填写本地项目路径" }));
      }

      break;
    case "/api/editConfig":

      req.once("data", (chunk: string) => {
        data += chunk.toString();
      });
      req.once("end", () => {
        const body = JSON.parse(data);
        const index = configs.findIndex((item) => item.value === body.value);
        if (index !== -1) {
          configs[index] = body;
          writeConfig(configs);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ code: 1, msg: "编辑成功" }));
        }else{
            res.end(JSON.stringify({ code: 0, msg: "未找到对应配置" }));
        }
      });
      break;
    case "/api/delConfig":
      req.once("data", (chunk: string) => {
        data += chunk.toString();
      })
      req.once("end", ()=>{
        const body = JSON.parse(data)
        const index = configs.findIndex((item) => item.value === body.value&&item.name===body.name);
        if(index<0){
            res.end(JSON.stringify({ code: 0, msg: "未找到对应配置" }));
        }else{
            configs.splice(index,1)
            writeConfig(configs)
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ code: 1, msg: "删除成功" }));
        }
      })
      break;
    case "/api/addConfig":
        req.once("data", (chunk: string) => {
          data += chunk.toString();
        })
        req.once("end", ()=>{
          const body = JSON.parse(data)
          const isExist = configs.find((item)=>{
            item.name===body.name||item.value===body.value
          })
          if(isExist){
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ code: 0, msg: "配置已存在" }));
          }else{
            configs.push(body)
            writeConfig(configs)
            res.end(JSON.stringify({ code: 1, msg: "添加成功" }));
          }
        })
      break;
    case '/api/getUser':
      const user = readUser();
      res.end(JSON.stringify({code: 1,data: user,msg:'获取成功'}))
      break
    case '/api/log':
      const logs = readLog()
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ code: 1, data: logs, msg: "获取成功" }));
      break;
    }
}

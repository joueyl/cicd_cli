import http from "node:http";
import ejs from "ejs";
import fs from "node:fs";
import path, { dirname } from "node:path";
import api from "../api/index";
import { fileURLToPath } from "node:url";
import { exec, spawn } from "child_process";
import {WebSocketServer} from "ws";
import url from 'node:url';
import {countErrorNUM,countSuccessNUM} from '../common/count';
export default function () {
  const server = http.createServer((req, res) => {
    if (req.url === "/") {
      fs.readFile(
        path.resolve(
          dirname(fileURLToPath(import.meta.url)),
          "./view/index.html"
        ),
        (err, data) => {
          if (err) {
            console.log(err);
            res.writeHead(500);
            return res.end("error");
          }
          const renderHtml = ejs.render(data.toString(), {
            title: "CICD-UI",
          });
          res.writeHead(200, { "Content-Type": "text/html" });
          return res.end(renderHtml);
        }
      );
    } else {
      if (req.url === "/favicon.ico") {
        fs.readFile(
          path.resolve(
            dirname(fileURLToPath(import.meta.url)),
            "./view/favicon.ico"
          ),
          (err, data) => {
            res.writeHead(200, { "Content-Type": "image/x-icon" });
            return res.end(data);
          }
        );
      }
      if (req.url?.includes("assets")) {
        serveStaticFiles(
          req,
          res,
          path.resolve(dirname(fileURLToPath(import.meta.url)), "./view/")
        );
      }
      if (req.url?.includes("api")) {
        api(req, res);
      }
    }
  });
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws) => {
      ws.on('message', (message) => {
         const child = spawn(`scd run ${JSON.parse(message.toString()).name}`, { shell: true, cwd: process.cwd() });
          child.stdout.on('data', (data) => {
              ws.send(JSON.stringify({
                  code: 1,
                  data: data.toString()
              }));
          })
          child.stderr.on('close', (code: number) => {
              ws.send(JSON.stringify({
                  code: 0,
                  data: code
              }));
              ws.close();
          })
          child.on('close', (code: number) => {
            if(code){
                countErrorNUM()
            }else{
                countSuccessNUM()
            }
          })
      }); 
  }); 
  server.on('upgrade', (request, socket, head) => {
      const pathname = url.parse(request.url as string).pathname;
      if (pathname === '/api/run') {
          wss.handleUpgrade(request, socket, head, (ws) => {
              wss.emit('connection', ws, request);
          });
      } else {
          socket.destroy();
      }
  });

  server.listen(3000, () => {
    console.log("`Server running at http://localhost:3000/`");
    // 定义要打开的URL
    const url = "http://localhost:3000/";

    // 根据操作系统的不同选择不同的命令
    let command;
    switch (process.platform) {
      case "darwin": // macOS
        command = `open ${url}`;
        break;
      case "win32": // Windows
        command = `start ${url}`;
        break;
      case "linux": // Linux
        command = `xdg-open ${url}`;
        break;
      default:
        throw new Error("Unsupported platform: " + process.platform);
    }

    // 执行命令
    exec(command, (error) => {
      if (error) {
        console.error(`Could not open the URL: ${error}`);
        return;
      }
    });
    // console.log("webUI目前仅做展示作用,功能暂未开发");
  });
}
function serveStaticFiles(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  publicDirectoryPath: string
) {
  // 构建文件的绝对路径
  let filePath = path.join(publicDirectoryPath, req.url as string);

  // 获取文件的扩展名
  let extname = String(path.extname(filePath)).toLowerCase();

  // 默认的 MIME 类型
  const mimeType: { [key: string]: string } = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".woff": "application/font-woff",
    ".ttf": "application/font-ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "application/font-otf",
    ".wasm": "application/wasm",
  };

  // 设置默认的响应内容类型是纯文本
  let contentType = mimeType[extname] || "text/plain";

  // 读取文件
  fs.readFile(filePath, function (error, content) {
    if (error) {
      if (error.code == "ENOENT") {
        // 如果文件不存在，返回404
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("404 Not Found");
      } else {
        // 服务器错误
        res.writeHead(500);
        res.end(
          "Sorry, check with the site admin for error: " + error.code + " ..\n"
        );
      }
    } else {
      // 成功读取文件
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
}

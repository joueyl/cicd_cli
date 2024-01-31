import http from 'node:http'
import ejs from 'ejs'
import fs from 'node:fs'
import path from 'node:path'
import api from '../api/index'
import { fileURLToPath } from 'node:url'
export default function (){
    const server = http.createServer((req, res) => {
        if(req.url==='/'){
            fs.readFile(path.relative(fileURLToPath(import.meta.url),'./dist/view/index.html'), (err, data) => {
             if(err){
                console.log(err)
                res.writeHead(500)
                return res.end('error')
             } 
             const renderHtml = ejs.render(data.toString(),{
                title:'CICD-UI'
             })  
             res.writeHead(200,{ 'Content-Type': 'text/html' })
            return res.end(renderHtml)
            })
        }else{
            if(req.url==='/favicon.ico'){
                fs.readFile(path.resolve(process.cwd(),'./dist/view/favicon.ico'), (err, data) => {
                        res.writeHead(200, { 'Content-Type': 'image/x-icon' })
                    return res.end(data)
                })
            }
            if(req.url?.includes('assets')){
                 serveStaticFiles(req, res, path.relative(fileURLToPath(import.meta.url),'./dist/view'));
            }
            if(req.url?.includes('api')){
                api(req, res)
            }
        }
    })
    server.listen(3000, () => {
        console.log('`Server running at http://localhost:3000/`')
    })
}
function serveStaticFiles(req: http.IncomingMessage, res: http.ServerResponse, publicDirectoryPath: string) {
    // 构建文件的绝对路径
    let filePath = path.join(publicDirectoryPath, req.url as string);

    // 获取文件的扩展名
    let extname = String(path.extname(filePath)).toLowerCase();

    // 默认的 MIME 类型
    const mimeType: { [key: string]: string } = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    // 设置默认的响应内容类型是纯文本
    let contentType = mimeType[extname] || 'text/plain';

    // 读取文件
    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                // 如果文件不存在，返回404
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('404 Not Found');
            } else {
                // 服务器错误
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        } else {
            // 成功读取文件
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}

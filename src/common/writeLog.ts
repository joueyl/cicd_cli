import fs from  'node:fs';
import envPaths from 'env-paths';
import path from 'node:path';
export default function readLog (text:string){
    const year = new Date().getFullYear()
    const month = new Date().getMonth()+1<10?'0'+(new Date().getMonth()+1):new Date().getMonth()+1
    const day = new Date().getDate()<10?'0'+new Date().getDate():new Date().getDate()
    const h = new Date().getHours()<10?'0'+new Date().getHours():new Date().getHours()
    const m = new Date().getMinutes()<10?'0'+new Date().getMinutes():new Date().getMinutes()
    const s = new Date().getSeconds()<10?'0'+new Date().getSeconds():new Date().getSeconds()
    const time = `${year}-${month}-${day} ${h}:${m}:${s}`
    fs.writeFileSync(path.resolve(envPaths("scd").config,'log.txt'),time+'  '+text+'\n',{
        flag: 'a+',
        encoding: 'utf-8'
    })
}
import {exec} from 'child_process'
import { log } from 'console'
export default function build(path:string,command:string) {
    return new Promise((resolve, reject) => {
        exec(command, {
            cwd: path,
        },(error, stdout, stderr)=>{
            console.log(stdout)
            
        }).on('error', reject).on('close',function(code){
            if(code){
                reject(code)
            }else{
                resolve(code)
            }
        })
    })
}
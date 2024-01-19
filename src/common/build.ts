import {exec} from 'child_process'
export default function build(path:string,command:string) {
    return new Promise((resolve, reject) => {
        exec(command, {
            cwd: path,
        }).on('exit', resolve).on('error', reject)
    })
}
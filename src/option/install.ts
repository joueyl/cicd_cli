import select from "./select";
import {execSync} from 'child_process'
export default async function install (projectPath:string){
 const {projectName} = await select(projectPath)
 execSync('npx pnpm install husky@8 -D',{cwd:`${projectPath}/`})
 console.log('安装husky成功')
 execSync('npx husky@8 install',{cwd:`${projectPath}/`})
 console.log('启用git钩子成功')
 execSync(`npm pkg set scripts.prepare="husky install"&&npx husky@8 add .husky/pre-push "scd run ${projectName}"`,{cwd:`${projectPath}/`})
 console.log('添加pre-push钩子成功')
}
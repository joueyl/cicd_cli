import select from "./select";
import {execSync} from 'child_process'
export default async function install (projectPath:string){
 const {projectName} = await select(projectPath)
 execSync('npm install husky -D',{cwd:`${projectPath}/`})
 execSync('npx husky install',{cwd:`${projectPath}/`})
 execSync(`npm pkg set scripts.prepare="husky install"&&npx husky add .husky/pre-push "scd run ${projectName}"`,{cwd:`${projectPath}/`})
}
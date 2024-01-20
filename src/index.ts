#!/usr/bin/env node
import {program} from 'commander' // 获取命令行参数
import readConfig from './common/readConfig'//读取配置文件
import add from './option/add'//添加配置
import remove from './option/remove'
import { list, listOnly } from './option/list'
import chalk from 'chalk'
import run from './common/selectRun'
import select from './option/select'
import edit from './option/edit'
import editKey from './option/editKey'
import { readFile } from "fs/promises"; // 以promise的方式引入 readFile API
import install from './option/install'

const json = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url)) as any
)

program.version(json.version)
program.command('add').action(async () => {
   await add()
}).description('添加一个项目').alias('a')
program.command('remove [name]').action(async (name) => {
    if(!name){
       const res = await select(name)
       await remove(res.projectName)
    }else{
        await remove(name)
    }
}).description('删除一个项目').alias('rm')
program.command('list [name]').action(async (name) => {
    
    if(name){
        console.log(name,'listOnly')
        await listOnly(name)
    }else{
        await list()
    }
}).description('查看一个或所有项目').alias('ls')
program.command('run [name]').action(async (name) => {
    if(!name){
       const res = await select(name)
       name = res.projectName
    }
    const config = readConfig()
    if(!config.length){
        console.log(chalk.red("scd 🧐 无配置项,请运行scd add去添加一个吧"))
        process.exit(0)
    }
    const res = config.find((res) => res.name === name)
    if(!res){
        console.log(chalk.red(`scd 🥵 ${name}配置不存在`))
        process.exit(0)
    }else{
        await run(res)
    }
}).description('运行项目或指定一个项目').alias('r')
program.command('edit [name] [key]').action(async(name,key) => {
    if(!key&&!name){
        const res = await select(name)
        name = res.projectName
        await edit(name)
        process.exit(0)
     }
     if(key&&name){
         await editKey(name,key)
     }else {
        await edit(name,key)
     }
    
}).description('编辑一个项目或项目配置').alias('e')
program.command('help').action(() => {
    program.outputHelp()
}).description('查看帮助').alias('h')
program.command('install').action(async() => {
    await install(process.cwd())
    console.log(process.cwd())
}).description('执行项目初始化').alias('i')
program.parse(process.argv)

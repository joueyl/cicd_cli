#!/usr/bin/env node
import envPaths from "env-paths";
import fs from 'node:fs'
import path from 'node:path'
//判断config.json是否存在不存在则添加
 checkConfig(envPaths("scd").config)
 function checkConfig (_path: string) {
    if(!fs.existsSync(_path)){
        fs.mkdirSync(_path, { recursive: true })
        fs.writeFileSync(path.resolve(_path,'config.json'),JSON.stringify([]))
    }
 }
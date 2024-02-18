import fs from 'node:fs'
import path from 'node:path'
import envPaths from 'env-paths'

export default function () {
    const res = fs.readFileSync(path.resolve(envPaths("scd").config,'log.txt'),{encoding: 'utf-8'})
    return res
}
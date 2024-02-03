import fs from 'node:fs'
import { resolve } from 'node:path'
import envPaths from 'env-paths'
export function writeUser(user:User) {
    const current = resolve(envPaths("scd").config,'user.json')
    fs.writeFileSync(current,JSON.stringify(user),{})
}
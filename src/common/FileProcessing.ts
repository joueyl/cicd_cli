import archiver from 'archiver'
import fs from 'node:fs'
import path from 'node:path'
import chalk from 'chalk'
/**
 * 文件处理
 */
export function zipFile(localPath:string,releasePath:string) {
    console.log(chalk.blue('ZIP ⏳ 正在压缩文件...'))
    return new Promise<void>((resolve, reject) => {
        const output = fs.createWriteStream(path.resolve(localPath, 'dist.zip'));
        const archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        })
        archive.pipe(output);
        archive.directory(path.resolve(localPath, 'dist'),releasePath);
        archive.finalize()
        output.on('close', () => {
            chalk.green('ZIP 压缩完成')
            chalk.green(console.log(`${chalk.green('SAVE 💾 '+(archive.pointer() / 1024 / 1024).toFixed(2)+'MB')}字节的数据已被写入：${chalk.blue(localPath)}`))
            resolve()
        })
        output.on('error', reject)
    })
}
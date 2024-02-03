import runSSH from '../option/runSSH'
import runFTP from '../option/runFTP'
import { countRunNUM } from './count'
import { countSuccessNUM } from './count'
export default async function selectRun(config:Config){
    countRunNUM()
    switch(config.serverType){
        case 'ssh':
            runSSH(config).then(() => {
                process.exit(0)
            }).catch((error) => {
                process.exit(1)
            })
            break
        case 'ftp':
          await runFTP(config).then(() => {
              process.exit(0)
          }).catch((error) => {
              process.exit(1)
          })
            break
    }
} 
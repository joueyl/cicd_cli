import runSSH from '../option/runSSH'
import runFTP from '../option/runFTP'
import { countRunNUM } from './count'
import { countSuccessNUM, countErrorNUM } from './count'
import type{Config} from '../../types/config'
export default async function selectRun(config:Config){
    countRunNUM()
    switch(config.serverType){
        case 'ssh':
            runSSH(config).then(() => {
                countSuccessNUM()
                process.exit(0)
            }).catch((error) => {
                countErrorNUM()
                process.exit(1)
            })
            break
        case 'ftp':
          await runFTP(config).then(() => {
              countSuccessNUM()
              process.exit(0)
          }).catch((error) => {
              countErrorNUM()
              process.exit(1)
          })
            break
    }
} 
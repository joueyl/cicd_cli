import runSSH from '../option/runSSH'
import runFTP from '../option/runFTP'
export default async function selectRun(config:Config){
    switch(config.serverType){
        case 'ssh':
            runSSH(config)
            break
        case 'ftp':
           await runFTP(config)
            break
    }
} 
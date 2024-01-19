import runSSH from '../option/runSSH'
import runFTP from '../option/runFTP'
export default function selectRun(config:Config){
    switch(config.serverType){
        case 'ssh':
            runSSH(config)
            break
        case 'ftp':
            runFTP(config)
            break
    }
} 
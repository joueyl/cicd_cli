import { readUser } from "../common/readUser";
import { writeUser } from "./writeUser";
export const countRunNUM = () => {
    const user = readUser()
    user.runNUM++
    writeUser(user)
}
export const countSuccessNUM = () => {
    const user = readUser()
    user.runSuccess++
    writeUser(user)
}
export const countErrorNUM = () => {
    const user = readUser()
    user.runError++
    writeUser(user)
}
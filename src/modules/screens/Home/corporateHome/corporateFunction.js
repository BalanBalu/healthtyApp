import { CURRENT_APP_NAME } from "../../../../setup/config";
import {arrangeFullName} from '../../../common'
export function getMemberNameWithStatus(data) {

    let name = CURRENT_APP_NAME + " user"
    let status = ''
    if (data) {
        if (data.maritalStatus === 'MARRIED') {
            if (data.gender === 'MALE') {
                status = 'Mr.'
            } else {
                status = 'Mrs'
            }
        }
        name = `${status} ${arrangeFullName(data&&data.firstName,data&&data.middleName,data&&data.lastName)}`
    }

    return name

}
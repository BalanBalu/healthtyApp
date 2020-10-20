import { CURRENT_APP_NAME } from "../../../../setup/config";
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
        name = `${status} ${data.firstName || ''}${data.middleName ? ' ' + data.middleName + ' ' : ''} ${data.lastName || ''}`
    }

    return name

}
export function getMemberNameWithStatus(data) {

    let name = "medflic user"
    let status = ''
    if (data) {
        if (data.maritalStatus === 'MARRIED') {
            if (data.gender === 'MALE') {
                status = 'Mr.'
            } else {
                status = 'Mrs'
            }
        } 
        name = `${status + (data.firstName || '' )+ (' '+data.middleName || '') + (' '+data.lastName||'')}`
    }

    return name

}
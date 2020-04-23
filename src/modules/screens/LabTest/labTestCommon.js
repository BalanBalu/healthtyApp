
export const renderLabTestImage = (data) => {
    let source = null;
    if (data.profile_image) {
        source = { uri: data.profile_image.imageURL }
    } else {
        // source = require('../../assets/images/Logo.png')
    }
    return (source)
}

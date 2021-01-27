import React from 'react';
import { Modal,TouchableOpacity, Text, BackHandler} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { IS_ANDROID } from '../../../setup/config';
 
/*const images = [{
    // Simplest usage.
    url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',
 
    // width: number
    // height: number
    // Optional, if you know the image size, you can set the optimization performance
 
    // You can pass props to <Image />.
    props: {
        // headers: ...
    }
}, {
    url: '',
    props: {
        // Or you can set source directory.
        source: require('../background.png')
    }
}]
*/
 
export default class ZoomImageViewer extends React.PureComponent {
    
    state = {
        visible : true
    }
    
    customHeader() {
       
            return (
                <TouchableOpacity onPress={() => this.setState({ visible : false}) }>
                     <Text style={{ color: 'white', height: 40, position: 'absolute', left: 20 }}> Cancel </Text>
                </TouchableOpacity>
            )
        }
    
    render() {
        const images = this.props.navigation.getParam('images') || [];  
        const { visible } = this.state;  
        return (    
            <Modal visible={visible}
            onRequestClose={() => {
                this.setState({ visible: false });
                this.props.navigation.pop()
            }}
            animationType={'fade'}
            transparent={true}>
                <ImageViewer
                    renderHeader={() => <TouchableOpacity 
                        style={{ marginTop: IS_ANDROID ? 5 : 60, marginLeft: 10  }}
                        onPress={() => {
                            this.setState({ visible : false} );
                            this.props.navigation.pop() }}>
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}> Cancel</Text>
                        </TouchableOpacity>
                    }
                 imageUrls={images}
                 menus
                 />
            </Modal>
        )
    }
}
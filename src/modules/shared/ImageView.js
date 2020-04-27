import React, { Component } from 'react';
import {
    Container, Content
} from 'native-base';
import { StyleSheet, Image, Dimensions } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
class ImageView extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            getImage: props.navigation.getParam('passImage')
        }
    }

    render() {
        const { getImage } = this.state
        return (
            <Container>
                <Content contentContainerStyle={styles.content}>


                    <ImageZoom cropWidth={Dimensions.get('window').width}
                        cropHeight={Dimensions.get('window').height - 200}
                        imageWidth={300}
                        minScale={0.6}
                        imageHeight={300}>
                        <Image
                            source={getImage}
                            style={{
                                width: 300, height: 300
                            }}
                        />

                    </ImageZoom>

                </Content>
            </Container>
        )
    }
}

export default ImageView;

const styles = StyleSheet.create({
    container:
    {
        backgroundColor: '#ffffff',
    },

    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f2f2f2'
    }


});
import React, { Component } from 'react';
import {
    Container, Content, Text, View, Button, H3, Item, Card,
    Input, Left, Right, Icon, Footer, Badge, Form, CardItem, Toast
} from 'native-base';
import { Checkbox } from 'react-native-paper';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TouchableOpacity, AsyncStorage, FlatList, TouchableHighlight, Modal, Dimensions } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import ImageZoom from 'react-native-image-pan-zoom';
class ImageView extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {

        return (
            <Container>
                <Content contentContainerStyle={styles.content}>


                    <ImageZoom cropWidth={Dimensions.get('window').width}
                        cropHeight={Dimensions.get('window').height - 200}
                        imageWidth={300}
                        minScale={0.6}
                        imageHeight={300}>
                        <Image
                            // source={this.props.prescription_path}
                            source={require('../../../../../assets/images/images.jpeg')}
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
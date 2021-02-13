

import React from 'react';
import { View, Modal } from "react-native";
import { Text, Button } from 'native-base';
import { Row } from 'react-native-easy-grid';

const confirmPopup = (props) => {
    const { confirmButtonText, cancelButtonText, warningMessageText, confirmButtonAction, cancelButtonAction, confirmButtonStyle, cancelButtonStyle } = props;
    if (props.visible) {
        return <Modal
            visible={props.visible}
            transparent={true}
            animationType={'fade'}
        >
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)'
            }}>
                <View style={{
                    width: '80%',
                    height: '25%',
                    backgroundColor: '#fff',
                    borderColor: 'gray',
                    borderWidth: 3,
                    padding: 10,
                    borderRadius: 10
                }}>

                    <Text style={{ fontSize: 18, fontFamily: 'OpenSans', fontWeight: 'bold', textAlign: 'center', marginTop: 10 }}>{warningMessageText}</Text>
                    <Row style={{ marginTop: 15, justifyContent: 'flex-end', marginBottom: 15 }}>

                        <Button danger style={cancelButtonStyle || {
                            marginTop: 15,
                            borderRadius: 10,
                            marginRight: 25,
                            height: 30
                        }} onPress={() => cancelButtonAction()} testID='cancelButton'>
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center', }}> {cancelButtonText || 'Cancel'}</Text>
                        </Button>
                        <Button success style={confirmButtonStyle || {
                            marginTop: 15,
                            borderRadius: 10,
                            marginRight: 15,
                            height: 30,
                            padding: 5
                        }} onPress={() => confirmButtonAction()} testID='confirmButton'>
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center', }}>{confirmButtonText || 'Confirm'}</Text>
                        </Button>

                    </Row>
                </View>

            </View>
        </Modal>
    } else {
        return null;
    }
}

export default confirmPopup;
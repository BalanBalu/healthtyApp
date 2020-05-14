

import React from 'react';
import { View } from "react-native";
import { Text, Button } from 'native-base';
import { Row } from 'react-native-easy-grid';
import Modal from 'react-native-modal';

const ModalPopup = (props) => {
  const { errorMessageText, closeButtonText, closeButtonAction } = props;
  if (props.visible) {
    return <Modal

      testID={'modal'}
      isVisible={props.visible}
      onSwipeComplete={() => props.visible}
      swipeDirection={['up', 'left', 'right', 'down']}
      style={{
        justifyContent: 'flex-end',
        margin: 0,
      }}>
      <View style={{
        backgroundColor: 'white',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
      }}>
        <Text style={{ fontSize: 16, marginTop: 12, color: 'red', }}>{errorMessageText}</Text>
        <Button transparent onPress={() => closeButtonAction()} testID={'closeButton'}>
          <Text style={{ fontSize: 14, marginBottom: 12, }}>{closeButtonText}</Text>
        </Button>
      </View>
    </Modal>

    } else {
  return null;
}         
}

export default ModalPopup;


import React from 'react';
import { View, Modal } from "react-native";
import { Text, Button } from 'native-base';
import { Row } from 'react-native-easy-grid';

const insuranceRenewalPopup = (props) => {
    const { callbackButtonText, renewOnlineButtonText, messageText, callbackButtonAction, renewOnlineButtonAction, popUpClose, cancelButtonStyle } = props;
    if (props.visible) {
        return <Modal
        visible={this.state.descriptionVisible}
        transparent={true}
        animationType={'fade'}>
        <View style={styles.modalFirstView}>
          <View style={styles.modalSecondView}>
            <Row
              style={{
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                marginTop: -30,
              }}>
              <TouchableOpacity onPress={() => popUpClose()}>
                <MaterialIcons
                  name="close"
                  style={{fontSize: 30, color: 'red'}}
                />
              </TouchableOpacity>
            </Row>
            <Row style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.modalHeading}>{messageText}</Text>
            </Row>

            <Row
              style={{
                marginTop: 15,
                justifyContent: 'flex-end',
                marginBottom: 5,
              }}>
              <Col size={5}>
                <TouchableOpacity
                  danger
                  style={styles.backToHomeButton1}
                  onPress={() => callbackButtonAction()}
                  testID="callbackButton">
                  <Text style={styles.backToHomeButtonText1}>{callbackButtonText}</Text>
                </TouchableOpacity>
              </Col>
              <Col size={5} style={{marginLeft: 10}}>
                <TouchableOpacity
                  danger
                  style={styles.backToHomeButton}
                  onPress={() =>renewOnlineButtonAction()}
                  testID="renewOnlineButton">
                  <Text style={styles.backToHomeButtonText}>{renewOnlineButtonText}</Text>
                </TouchableOpacity>
              </Col>
            </Row>
          </View>
        </View>
      </Modal>
    } else {
        return null;
    }
}

export default insuranceRenewalPopup;
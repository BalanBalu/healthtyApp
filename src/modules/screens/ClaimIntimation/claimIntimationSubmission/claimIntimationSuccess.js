import React, { PureComponent } from 'react';
import { Container, Content, Text, Button, Card, Icon } from 'native-base';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../Styles';
import {translate} from '../../../../setup/translator.helper';

export default class ClaimPaymentSuccess extends PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Container style={{ backgroundColor: '#ffffff' }}>
                <ScrollView>
                    <Content style={{ padding: 18 }}>
                        <Card style={styles.mainCard}>
                            <View style={{ alignItems: 'center', marginTop: 15 }}>
                                <Icon name="checkmark-circle" style={styles.circleIcon} />
                            </View>
                            <Text style={styles.successHeading}>{translate("SUCCESS")}</Text>
                            <Text style={styles.subText}>{ this.props.navigation.getParam('successMsg') ? this.props.navigation.getParam('successMsg') : null}  <Text style={{
                                    textAlign: 'center',
                                    fontFamily: 'Roboto',
                                    fontSize: 18,
                                    marginTop: 5,
                                    color: '#535353',
                                    marginLeft: 20,
                                    marginRight: 20,
                                    fontWeight: 'bold'
                                }}>
                             {this.props.navigation.getParam('referenceNumber') ?`" ${this.props.navigation.getParam('referenceNumber')} "` : null}</Text></Text>
                        </Card>
                        <Button onPress={() => this.props.navigation.navigate('CorporateHome')}
                            block style={{ marginTop: 5, borderRadius: 10, marginBottom: 10, backgroundColor: '#5bb85d' }}>
                            <Text style={styles.customizedText}> {translate("Home")} </Text>
                        </Button>
                    </Content>
                </ScrollView>
            </Container>
        )
    }
}


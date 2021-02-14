import React, { PureComponent } from 'react';
import { Container, Content, Text, Button, Card, Icon } from 'native-base';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../Styles';

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
                            <Text style={styles.successHeading}>SUCCESS</Text>
                            <Text style={styles.subText}>Your Claim Intimation request is being processed, will be notified on successful
            completion of request, your reference id is   <Text style={{
                                    textAlign: 'center',
                                    fontFamily: 'OpenSans',
                                    fontSize: 18,
                                    marginTop: 5,
                                    color: '#535353',
                                    marginLeft: 20,
                                    marginRight: 20,
                                    fontWeight: 'bold'
                                }}>" {this.props.navigation.getParam('referenceNumber') ? this.props.navigation.getParam('referenceNumber') : null} "</Text></Text>
                        </Card>
                        <Button onPress={() => this.props.navigation.navigate('CorporateHome')}
                            block style={{ marginTop: 5, borderRadius: 10, marginBottom: 10, backgroundColor: '#5bb85d' }}>
                            <Text style={styles.customizedText}> Home </Text>
                        </Button>
                    </Content>
                </ScrollView>
            </Container>
        )
    }
}


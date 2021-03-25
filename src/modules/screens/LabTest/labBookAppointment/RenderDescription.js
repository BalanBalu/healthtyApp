import React, { PureComponent, Component } from 'react';
import { Container, Content, Text, Segment, Button, Card, Right, Thumbnail, Icon, Toast, Item, Footer, Spinner, List, ListItem, Left, Body } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, TouchableOpacity, View, FlatList, Image } from 'react-native';
import styles from '../styles';
import {primaryColor} from '../../../setup/config'


export default class RenderDescription extends Component {
    constructor(props) {
        super(props)
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     return nextProps.shouldUpdate !== this.props.shouldUpdate;
    // }

    render() {
        const { showMoreOption, labDescriptionData, onPressShowAndHide } = this.props;
        return (

            // <View>
            //     <View style={{ marginLeft: 5, marginRight: 5, marginTop: 10 }}>
            //         <Text note style={{ fontFamily: 'Roboto', fontSize: 12, }}>Description</Text>
            //         <Text style={styles.customText}>Quest Diagnostics India Pvt Ltd in Nungambakkam boasts of a state of the art center,which is fully equipped with modern diagnostic equipment.from the time servive seekers walk in,they find themselves in ahealthy and hygienic environment.</Text>
            //         <Text style={{ fontFamily: 'Roboto', color: 'blue', fontSize: 14 }} onPress={() => this.setState({ showMoreOption: false })}>...Hide</Text>
            //     </View>
            //     <Row style={{ marginLeft: 5, marginRight: 5, paddingBottom: 5 }}>
            //         <Right><Text style={{ fontFamily: 'Roboto', fontSize: 15, color: primaryColor }}></Text></Right>
            //     </Row>
            // </View>


            <View>
                <View style={{ marginLeft: 5, marginRight: 5, marginTop: 10 }}>
                    <Text note style={styles.descriptionLabelName}>Description</Text>
                    {!showMoreOption ?
                        <Text style={styles.descriptionText}>{(labDescriptionData).slice(0, 100)}
                            <Text style={styles.viewMoreAndHideText} onPress={() => onPressShowAndHide(true)}>{labDescriptionData.length > 100 ? '...View More' : ''}
                            </Text>
                        </Text> :
                        <Text style={{ fontFamily: 'Roboto', fontSize: 12 }}>{labDescriptionData} <Text style={styles.viewMoreAndHideText} onPress={() => onPressShowAndHide(false)}>...Hide</Text></Text>}
                </View>
                <Row style={{ marginLeft: 5, marginRight: 5, paddingBottom: 5 }}>
                    <Right><Text style={{ fontFamily: 'Roboto', fontSize: 15, color: primaryColor }}></Text></Right>
                </Row>
            </View>
        )
    }
}

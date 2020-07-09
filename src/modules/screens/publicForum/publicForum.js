import React, { PureComponent } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Form, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TouchableOpacity, View, BackHandler } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import styles from './styles'

class PublicForum extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        const datas = [{
            symptoms: 'Symptoms of indigestion', answerCount: 12, date: 'September 20,2019',
            description: 'Expecteur sint occaecat cupidatat non proident,sunt in culpa qui officideserunt mollit anim id est laborume Sed ut perspiciatis unde omnisiste natus error sit voluptatem accusantium doloremque.'
        },
        {
            symptoms: 'Symptoms of indigestion', answerCount: 12, date: 'September 20,2019',
            description: 'Expecteur sint occaecat cupidatat non proident,sunt in culpa qui officideserunt mollit anim id est laborume Sed ut perspiciatis unde omnisiste natus error sit voluptatem accusantium doloremque.'
        },
        {
            symptoms: 'Symptoms of indigestion', answerCount: 12, date: 'September 20,2019',
            description: 'Expecteur sint occaecat cupidatat non proident,sunt in culpa qui officideserunt mollit anim id est laborume Sed ut perspiciatis unde omnisiste natus error sit voluptatem accusantium doloremque.'
        },
        {
            symptoms: 'Symptoms of indigestion', answerCount: 12, date: 'September 20,2019',
            description: 'Expecteur sint occaecat cupidatat non proident,sunt in culpa qui officideserunt mollit anim id est laborume Sed ut perspiciatis unde omnisiste natus error sit voluptatem accusantium doloremque.'
        }

        ]
        return (
            <Container style={styles.container}>
                <Content style={styles.bodyContent}>
                    <View style={{ backgroundColor: '#ECDCFA', paddingTop: 8, paddingBottom: 8, paddingRight: 10, marginTop: 5 }}>
                        <Grid>
                            <Col>
                                <Form>
                                    <Row>
                                        <Col size={9}>
                                            <Item style={styles.transparentLabel1}>
                                                <Input placeholder="Type Yoyur Query" style={styles.firstTransparentLabel}
                                                    placeholderTextColor="#C1C1C1"
                                                    keyboardType={'default'}
                                                    returnKeyType={'go'}
                                                    multiline={false}

                                                />

                                            </Item>
                                        </Col>
                                        <Col size={1}>
                                            <TouchableOpacity style={styles.iconStyle} >
                                                <Icon name='ios-search' style={{ fontSize: 20, color: '#fff' }} />
                                            </TouchableOpacity>
                                        </Col>
                                    </Row>

                                </Form>
                            </Col>
                        </Grid>
                    </View>
                    <View>
                        <Text>Ask Query To Qualfied Doctors</Text>
                        <FlatList
                            data={datas}
                            renderItem={({ item }) =>
                                <View style={{ borderBottomColor: 'gray', borderBottomWidth: 0.3, paddingBottom: 10, marginTop: 15 }}>
                                    <Row>
                                        <Col size={1}>
                                            <Image source={require('../../../../assets/images/Female.png')} style={{ height: 30, width: 30 }} />
                                        </Col>
                                        <Col size={9}>
                                            <Row>
                                                <Col size={8}>
                                                    <Text style={styles.symptomsText}>{item.symptoms}</Text>
                                                </Col>
                                                <Col size={2}>
                                                    <Text style={styles.answerText}>{item.answerCount} Answered</Text>
                                                </Col>
                                            </Row>
                                            <Text note style={styles.dateText}>{item.date}</Text>
                                        </Col>
                                    </Row>
                                    <Text style={styles.descriptionText}>{item.description}</Text>
                                </View>
                            } />
                    </View>
                </Content>
                <Footer style={styles.footerStyle}>
                    <Row>
                        <Col size={1} style={styles.colstyle}>
                            <TouchableOpacity style={styles.pageCount}>
                                <Text style={{ color: '#7F49C3', fontSize: 12, fontWeight: 'bold' }}>{"<"}</Text>
                            </TouchableOpacity>
                        </Col>
                        <Col size={8} style={styles.colstyle}>
                            <TouchableOpacity style={[styles.pageCount, { alignItems: 'center', justifyContent: 'center' }]}>
                                <Text style={{ color: '#7F49C3', fontSize: 12, fontWeight: 'bold' }}>1</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.pageCount, { alignItems: 'center', justifyContent: 'center' }]}>
                                <Text style={{ color: '#7F49C3', fontSize: 12, fontWeight: 'bold' }}>2</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.pageCount, { alignItems: 'center', justifyContent: 'center' }]}>
                                <Text style={{ color: '#7F49C3', fontSize: 12, fontWeight: 'bold' }}>3</Text>
                            </TouchableOpacity>
                        </Col>
                        <Col size={1} style={styles.colstyle}>
                            <TouchableOpacity style={styles.pageCount}>
                                <Text style={{ color: '#7F49C3', fontSize: 12, fontWeight: 'bold' }}>{">"}</Text>
                            </TouchableOpacity>
                        </Col>
                    </Row>
                </Footer>
            </Container>

        )
    }

}


export default PublicForum



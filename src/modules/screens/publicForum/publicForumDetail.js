import React, { PureComponent } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Form, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TouchableOpacity, View, BackHandler, TextInput } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import styles from './styles'

class PublicForumDetail extends PureComponent {
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
                 <Row>
                    <Col size={1.5}>
                        <Image source={require('../../../../assets/images/Female.png')} style={{ height: 50, width: 50 }} />
                    </Col>
                    <Col size={8.5} style={{marginTop:5,marginLeft:5}}>
                      <Text style={styles.symptomsText}>Prevention for Covid - 19</Text>
                      <Text note style={styles.dateText}>Raised by Anup singh</Text>
                    </Col>
                 </Row>
                 <Text style={[styles.postText],{marginTop:10}} >Leave Your Answer</Text>
                 <View style={{ marginTop: 10 }}>
                        <Text style={styles.smallHeading}>Your Name</Text>
                        <TextInput
                            onChangeText={complaint => this.setState({ complaint })}
                            multiline={true} placeholder="Type your name"
                            style={styles.textInput3} />
                    </View>
                    <View style={{ marginTop: 15 }}>
                        <Text  style={styles.smallHeading}>Your Answer</Text>
                        <TextInput
                            onChangeText={complaint => this.setState({ complaint })}
                            multiline={true} placeholder="Type your answer"
                            style={styles.textInput4} />
                    </View>
                    <TouchableOpacity style={styles.postAnswerButton}>
                        <Text style={styles.postAnswerText}>Post Your Answer</Text>
                    </TouchableOpacity>
                    <View style={styles.borderView}>
                        <Text style={{color:'#7F49C3',fontSize:12,fontFamily:'OpenSans',}}>10 answers</Text>
                        <FlatList
                            data={datas}
                            renderItem={({ item }) =>
                                <View style={{ borderTopColor: 'gray', borderTopWidth: 0.3, paddingTop: 10, marginTop: 10}}>
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
                                <Text style={styles.pageCountText}>{"<"}</Text>
                            </TouchableOpacity>
                        </Col>
                        <Col size={8} style={styles.colstyle}>
                            <TouchableOpacity style={[styles.pageCount, { alignItems: 'center', justifyContent: 'center' }]}>
                                <Text style={styles.pageCountText}>1</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.pageCount, { alignItems: 'center', justifyContent: 'center' }]}>
                                <Text style={styles.pageCountText}>2</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.pageCount, { alignItems: 'center', justifyContent: 'center' }]}>
                                <Text style={styles.pageCountText}>3</Text>
                            </TouchableOpacity>
                        </Col>
                        <Col size={1} style={styles.colstyle}>
                            <TouchableOpacity style={styles.pageCount}>
                                <Text style={styles.pageCountText}>{">"}</Text>
                            </TouchableOpacity>
                        </Col>
                    </Row>
                </Footer>
            </Container>

        )
    }

}


export default PublicForumDetail



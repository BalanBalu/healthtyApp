import React, { PureComponent } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Form, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox,Toast } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TouchableOpacity, View, BackHandler, TextInput,AsyncStorage } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import {forumInsertQuestion} from '../../providers/forum/forum.action'
import styles from './styles'

class PostForum extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            question_title:'',
            question_description:''
        }
    }

    insertForumQuestions = async() => {
     try {
            if ((this.state.question_title == '') || (this.state.question_description == '')) {
              Toast.show({
                text: 'Kindly fill all the fields',
                type: 'danger',
                duration: 3000
              });
            } 
      
            else {
                let type = ''
                let userId = await AsyncStorage.getItem('userId');
                  if(userId != null){
                      type = 'user'
                  }else{
                    type = 'unknown'
                  }
                
              let data = {
                type:type,
                question_name:this.state.question_title,
                description: this.state.question_description,
                questioner_id:"",
                active: true
              }
              if(userId != null){
                data.questioner_id = userId
            }
              let result = await forumInsertQuestion(data)
              alert(JSON.stringify(result))
              if (result.success) {
                Toast.show({
                  text: result.message,
                  type: "success",
                  duration: 3000,
                })
    
              }
              else {
                Toast.show({
                  text: result.message,
                  type: "danger",
                  duration: 5000
                })
              }
            }
          }
          catch (e) {
            console.log(e.message)
          }
        }
    



    render() {
// alert(this.state.question_description == '')
        return (
            <Container style={styles.container}>
                <Content style={styles.bodyContent}>
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.postText}>Enter Question Title</Text>
                        <TextInput
                            multiline={false} 
                            placeholder="Type question title"
                            placeholderTextColor="#696969"
                            keyboardType={'default'}
                            returnKeyType={'go'}
                            autoFocus={true}
                            value={this.state.question_title}
                            onChangeText={enteredText => this.setState({ question_title: enteredText })}
                            style={styles.textInput1} />
                    </View>
                    <View style={{ marginTop: 15 }}>
                        <Text style={styles.postText}>Enter Question</Text>
                        <TextInput
                            multiline={true}   
                            placeholder="Type Description"
                            placeholderTextColor="#696969"
                            keyboardType={'default'}
                            returnKeyType={'go'}
                            autoFocus={true}
                            value={this.state.question_description}
                            onChangeText={enteredText => this.setState({ question_description: enteredText })}
                            style={styles.textInput2} />
                    </View>
                    <TouchableOpacity style={styles.postAnswerButton} onPress={this.insertForumQuestions}>
                        <Text style={styles.postAnswerText}>Post Your Questions</Text>
                    </TouchableOpacity>
                </Content>
            </Container>

        )
    }

}


export default PostForum



import React, { PureComponent } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Form, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TouchableOpacity, View, BackHandler,ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import styles from './styles'
import {searchSuggestionsForQuestionsAndAnswers,getAllPublicForumDetails} from '../../providers/forum/forum.action'
import { Loader } from '../../../components/ContentLoader';
import { formatDate } from "../../../setup/helpers";
import { connect } from 'react-redux'

const debounce = (fun, delay) => {
    let timer = null;
    return function (...args) {
      const context = this;
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        fun.apply(context, args);
      }, delay);
    };
  }
class PublicForum extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
          isLoading:false,
          data:[],
          querySugesstionArray:[],
          query_text:'',
          skip: 0,
          limit: 10
      };
      this.onEndReachedCalledDuringMomentum = false;
     this.callquerysearchService = debounce(this.callquerysearchService, 500); 
    }
    componentDidMount() {
        this.callquerysearchService()
    }
    SearchKeyWordFunction =  async (enteredText) =>{
        if (enteredText == '') {
            this.setState({ data: this.state.data, query_text: enteredText })
          } else {
            this.setState({ query_text: enteredText })
            this.callquerysearchService(enteredText);
          }
    }
    callquerysearchService = async (enteredText) => {
        if(this.state.query_text == ''){
            let result = await getAllPublicForumDetails(this.state.skip,this.state.limit)
            if (result.success) {
                let forumFetced = result.data
                this.setState({ data: forumFetced })
                console.log("Wholedata=========<<<<<<<<<<<<<", JSON.stringify(result.data))
            }
        }else{
      let queryResultData = await getAllPublicForumDetails(enteredText,this.state.skip,this.state.limit);
       console.log('query+++++++++++++++++' + JSON.stringify(queryResultData))
    //    alert(JSON.stringify(queryResultData))
       if (queryResultData.success) {
          this.setState({
            data: queryResultData.data,
            searchValue: enteredText,
            setShowSuggestions: true
          });
        } else {
          this.setState({
            data: [],
            searchValue: enteredText,
            setShowSuggestions: false,
            isLoading:true
          });
        }
    }
         }
         renderFooter() {
            return (
                //Footer View with Load More button
                <View style={styles.footer}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={this.loadMoreData}
    
                        style={styles.loadMoreBtn}>
                        {this.state.footerLoading ?
    
                            <ActivityIndicator color="blue" style={styles.btnText} /> : null}
    
                    </TouchableOpacity>
                </View>
            );
        }

         handleLoadMore = async () => {
               console.log('On Hanndle loading ' + this.state.skip);
            if (!this.onEndReachedCalledDuringMomentum) {
              
                this.onEndReachedCalledDuringMomentum = false;
                await this.setState({ skip: this.state.skip + this.state.limit, footerLoading: true });              
                await  this.callquerysearchService(this.state.query_text)
                console.log('loading>>>>>>>>.. ' + this.state.skip);

                this.setState({ footerLoading: false })
    
            }
        }
    



    render() {
        console.log(JSON.stringify(this.state.data))
        const { isLoading , data,  } = this.state;
        return (
            <Container style={styles.container}>
                 {isLoading ? <Loader style='list' /> :

                <View  style={{ flex: 1,padding:15,marginBottom:10 }}
                contentContainerStyle={{ flexGrow: 1 }}>
                        <View >
                            <View style={{ backgroundColor: '#ECDCFA', paddingTop: 8, paddingBottom: 8, paddingRight: 10, marginTop: 5,flexDirection:'row' }}>
                                <View style={{width:'70%'}}>
                                <Text style={{fontFamily:'OpenSans',fontSize:13,marginLeft:10}}>Ask Query To Qualified Doctors</Text>
                            <Text style={{fontFamily:'OpenSans',fontSize:18,fontWeight:'bold',marginTop:5,marginLeft:10}}>To Get Your Solution</Text>
                          <Row> 
                         <TouchableOpacity style={{paddingLeft:10,paddingRight:10,paddingTop:3,paddingBottom:3,borderColor:'#7F49C3',borderWidth:2,marginLeft:10,height:30,borderRadius:2,}}
                        onPress={() => this.props.navigation.navigate("PostForum")} >
                           <Text style={{fontFamily:'OpenSans',fontSize:13,textAlign:'center',color:'#7F49C3'}}>Post Your Questions</Text>
                         </TouchableOpacity>      
                         </Row>
                                </View>
                                <View size={3} style={{justifyContent:'center',alignItems:'center',width:'30%'}}>
                                    <Image source={require('../../../../assets/images/doctor-forum-bg.png')} style={{width:100,height:100}}/>
                                </View>
                         
                                </View>
                           </View> 
                    <View style={{ backgroundColor: '#ECDCFA', paddingTop: 8, paddingBottom: 8, paddingRight: 10, marginTop: 5 }}>
                       
                                <Form>
                                    <View style={{flexDirection:'row'}}>
                                        <View style={{width:'90%'}}>
                                            <Item style={styles.transparentLabel1}>
                                                <Input placeholder="Type Your Query" style={styles.firstTransparentLabel}
                                                    placeholderTextColor="#C1C1C1"
                                                    keyboardType={'default'}
                                                    returnKeyType={'go'}
                                                    multiline={false}
                                                    value={this.state.query_text}
                                                    autoFocus={true}
                                                    onChangeText={enteredText => this.SearchKeyWordFunction(enteredText)}
                                                />

                                            </Item>
                                        </View>
                                        <View style={{width:'10%'}}>
                                            <TouchableOpacity style={styles.iconStyle} >
                                                <Icon name='ios-search' style={{ fontSize: 20, color: '#fff' }} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                </Form>
                          
                    </View>
                    {this.state.setShowSuggestions == true ?
                  <View style={{
                    flex: 1,
                  }}>
                  </View>
                  : null}
                    <View>
                        <Text style={{fontFamily:'OpenSans',fontSize:15,}}>Ask Query To Qualfied Doctors</Text>
                        <FlatList
                            	data={data}
                                extraData={data}
                                onEndReached={() => this.handleLoadMore()}
                                onEndReachedThreshold={0.5}
                                onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = true; }}
                                ListFooterComponent={this.renderFooter.bind(this)}
                            renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("PublicForumDetail", {QuestionId:item._id })}>
                                <View style={{ borderBottomColor: 'gray', borderBottomWidth: 0.3, paddingBottom: 10, marginTop: 15 }}>
                                    <Row>
                                        <Col size={1}>
                                            <Image source={require('../../../../assets/images/Female.png')} style={{ height: 30, width: 30 }} />
                                        </Col>
                                        <Col size={9}>
                                            <Row>
                                                <Col size={8}>
                                                    <Text style={styles.symptomsText}>{item.question_name}</Text>
                                                </Col>
                                                <Col size={2}>
                                                    <Text style={styles.answerText}>{item.answersData.length} Answered</Text>

                                                </Col>
                                            </Row>
                                            <Text note style={styles.dateText}>{formatDate(item.created_date, 'MMMM DD,YYYY')}</Text>
                                        </Col>
                                    </Row>
                                    <Text style={styles.descriptionText}>{item.description}</Text>
                                </View>
                                </TouchableOpacity>
                            } />
                    </View>
                </View>
    }
            </Container>

        )
    }

}



function publicForumState(state) {

    return {
        PublicForum: state.PublicForum
    }
}
export default connect(publicForumState)(PublicForum)

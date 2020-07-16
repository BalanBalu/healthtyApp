import React, { PureComponent } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Form, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TouchableOpacity, View, BackHandler } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import styles from './styles'
import {searchSuggestionsForQuestionsAndAnswers,getAllPublicForumDetails} from '../../providers/forum/forum.action'
import { Loader } from '../../../components/ContentLoader';
import { formatDate } from "../../../setup/helpers";

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
          isLoading:true,
          data:[],
          querySugesstionArray:[],
          query_text:''

         
        }
        this.callquerysearchService = debounce(this.callquerysearchService, 500); 
    }
    componentDidMount() {
        this.getAllForumDetails()
    }


getAllForumDetails = async()=>{
try{
    this.setState({isLoading:true})
    let result = await getAllPublicForumDetails()
    if(result.success){
        let forumFetched = result.data
        this.setState({data:forumFetched})
        console.log("data=========<<<<<<<<<<<<<", JSON.stringify(result.data))
    }

}catch(e){
console.log(e)
}
finally{
this.setState({isLoading:false})
}
    }

    SearchKeyWordFunction =  async (enteredText) =>{
        if (enteredText == '') {
            this.setState({ querySugesstionArray: null, query_text: enteredText })
          } else {
            this.setState({ query_text: enteredText })
            this.callquerysearchService(enteredText);
          }
    }
    callquerysearchService = async (enteredText) => {
        let queryResultData = await searchSuggestionsForQuestionsAndAnswers(enteredText);
       console.log('query+++++++++++++++++' + JSON.stringify(queryResultData))
        if (queryResultData.success) {
          this.setState({
            querySugesstionArray: queryResultData.data,
            searchValue: enteredText,
            setShowSuggestions: true
          });
        } else {
          this.setState({
            querySugesstionArray: [],
            searchValue: enteredText,
            setShowSuggestions: false
          });
        }
      }
    render() {
        console.log(JSON.stringify(this.state.data))
        const { isLoading , data,  } = this.state;
        return (
            <Container style={styles.container}>
                 {isLoading ? <Loader style='list' /> :

                <Content style={styles.bodyContent}>
                        <View style={{ backgroundColor: '#ECDCFA', paddingTop: 8, paddingBottom: 8, paddingRight: 10, marginTop: 5 }}>
                            <Row>
                                <Col size={7}>
                                <Text style={{fontFamily:'OpenSans',fontSize:13,marginLeft:10}}>Ask Query To Qualified Doctors</Text>
                            <Text style={{fontFamily:'OpenSans',fontSize:18,fontWeight:'bold',marginTop:5,marginLeft:10}}>To Get Your Solution</Text>
                           <Row style={{marginTop:10}}>
                         <TouchableOpacity style={{paddingLeft:10,paddingRight:10,paddingTop:3,paddingBottom:3,borderColor:'#7F49C3',borderWidth:2,marginLeft:10,height:30,borderRadius:2}}
                        onPress={() => this.props.navigation.navigate("PostForum")} >
                           <Text style={{fontFamily:'OpenSans',fontSize:13,textAlign:'center',color:'#7F49C3'}}>Post Your Questions</Text>
                         </TouchableOpacity>      
                         </Row>
                                </Col>
                                <Col size={3} style={{justifyContent:'center',alignItems:'center'}}>
                                    <Image source={require('../../../../assets/images/doctor-forum-bg.png')} style={{width:100,height:100}}/>
                                </Col>
                         
                                </Row>
                           </View> 
                    <View style={{ backgroundColor: '#ECDCFA', paddingTop: 8, paddingBottom: 8, paddingRight: 10, marginTop: 5 }}>
                        <Grid>
                            <Col>
                                <Form>
                                    <Row>
                                        <Col size={9}>
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
                    {this.state.setShowSuggestions == true ?
                  <View style={{
                    flex: 1,
                  }}>
                    <FlatList
                      data={this.state.querySugesstionArray}
                      ItemSeparatorComponent={this.itemSaperatedByListView}
                      renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("PublicForumDetail", {QuestionId:item.id })}>
                          <Row style={{ borderBottomWidth: 0.3, borderBottomColor: '#cacaca' }}  >
                            <Text style={{ padding: 10, fontFamily: 'OpenSans', fontSize: 13, textAlign: 'left' }}>{item.value}</Text>
                          </Row>
                        </TouchableOpacity>
                      )}
                      enableEmptySections={true}
                      style={{ marginTop: 10 }}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                  : null}
                    <View>
                        <Text style={{fontFamily:'OpenSans',fontSize:15,}}>Ask Query To Qualfied Doctors</Text>
                        <FlatList
                            data={data}
                            extraData={this.state}
                            keyExtractor={(item, index) => index.toString()}
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
                </Content>
          } 
           {data.length !== 0 ?
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
                :null
                }
    
            </Container>

        )
    }

}


export default PublicForum



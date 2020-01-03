import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Left, Right, Thumbnail, Body, Icon, locations } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import LinearGradient from 'react-native-linear-gradient';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View, FlatList } from 'react-native';
import { catagries } from '../../providers/catagries/catagries.actions';


class Categories extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data:[],
    }
  }
  componentDidMount() {
    this.getCatagries();
  }
  getCatagries = async () => {
    try {
        let result = await catagries();
        if (result.success) { 
            this.setState({ data: result.data })
        }
    } catch (e) {
        console.log(e);
    } finally {
        this.setState( { isLoading : false });
    }
}

  navigateToCategorySearch(categoryName) {
    console.log(categoryName);
    let serachInputvalues = [{
      type: 'category',
      value: categoryName

    }]
    this.props.navigation.navigate('Doctor List', { resultData: serachInputvalues })
  }

  render() {
    const { user: { isLoading } } = this.props;
    return (
      <Container style={styles.container}>
        <Content style={styles.bodyContent}>
          <View style={{marginBottom:10}}>
          {isLoading ? <Spinner color='blue' /> : null}
          <FlatList horizontal={false} numColumns={1}
            data={this.state.data}
            extraData={this.state}
            renderItem={({ item, index }) =>

            <Col style={{
              alignItems: "center", 
              justifyContent: "center", 
              borderColor:'gray', 
              borderRadius:5, 
              flexDirection:'row', 
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 0.5 },
              shadowOpacity: 0.1,
              shadowRadius: 5,  
              elevation: 0,
              padding:1,
              marginTop:8,
              marginLeft:12,
              marginBottom:1,width:'94%',flexDirection:'row',backgroundColor:'#F5F5F5' }}>
             
                  <TouchableOpacity onPress={() => this.navigateToCategorySearch(item.category_name)} 
                                    style={{justifyContent:'center',alignItems:'center',width:'100%',paddingTop:5,paddingBottom:5,flexDirection:'row'}}>
            
            <Row> 
              <Col size={6} style={{justifyContent:'center'}}>
              <Text style={{fontSize:14, marginLeft:20, padding: 2,fontWeight:'700'}}>{item.category_name}</Text>

            </Col>
            <Col size={4} style={{alignItems:'flex-end',marginRight:20}}>
            <Image
                          source={{ uri: item.imageBaseURL + item.category_id + '.png'  }}
                       
                        style={{
                          width: 50,height:50, alignItems:'center'
                        }}
                  />
            </Col>
                 
                 
                 
                  
                 </Row>
                
                  </TouchableOpacity>
           
                  
      </Col> 

            
//               <Grid style={{ marginTop: 10, justifyContent: 'center', padding: 5, }}>
               
//                   {isLoading ? <Spinner color='blue' /> : null}
//                   <TouchableOpacity onPress={() => this.navigateToCategorySearch(item.category_name)} style={{alignItems:'center',marginBottom:5}}>

//                     <Col style={{width:'90%',}}>
//                       <LinearGradient
//                         colors={['#7357A2', '#62BFE4']} style={{
//                           flex: 1,
//                           borderRadius: 10,

                        
//                         }}>
//                         <Image
//                           source={{ uri: item.imageBaseURL + 'white/' + item.category_id + '.png' }} style={styles.customImage}
//                         //  source={{ uri: 'http://pluspng.com/img-png/orthopedics-png--350.png' }} style={styles.customImage}
//                         />
//                       </LinearGradient>

                      

//                     </Col>
//                     <Col style={{ padding: 2,
//     backgroundColor: '#FF9502',
//     borderRadius: 5,marginTop:10,justifyContent:'center',width:'90%',alignItems:'center'}}>
                    
// <Text style={styles.titleText}>{item.category_name}</Text>

//                     </Col>
                 
//                   </TouchableOpacity>
                
//               </Grid>
            }
            keyExtractor={(item, index) => index.toString()}
          />
          </View>
        </Content>
      </Container>

    )
  }

}

function appoinmentsState(state) {

  return {
    user: state.user
  }
}
export default connect(appoinmentsState, { login, messageShow, messageHide })(Categories)


const styles = StyleSheet.create({

  container:
  {
    backgroundColor: '#ffffff',
  },

  bodyContent: {
    padding: 5
  },
  textcenter: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'OpenSans'
  },

  column:
  {
    width: '15%',
    borderRadius: 10,
    margin: 10,
    padding: 6
  },


  customImage: {
    height: 100,
    width: 100,
    margin: 10,
    alignItems: 'center'
  },

  titleText: {
    fontSize: 12,
  textAlign:'center',
    color: 'white',
    fontFamily: 'OpenSans',
    
  },


});
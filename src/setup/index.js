import React,{ Component }  from 'react';
import RoutesHome from './routes/appRouterHome';
import RoutesLogin from './routes/appRouterLogin';
import { Provider } from 'react-redux';
import { store } from './store'
import { StyleProvider } from 'native-base';
import getTheme from '../theme/components';
import material from '../theme/variables/material';
import { AsyncStorage, Text } from 'react-native';
import { setDoctorLocally } from '../modules/providers/auth/auth.actions';

export default class App extends Component {
    constructor(props) {
      super(props);
      console.log('coming on Constructor');
       this.state = {
         isAuthenticated : false
       } 
    }
   async componentWillMount(){
    try {
        console.log('is that coming here?');
        const token = await AsyncStorage.getItem('token')
        if (token && token !== 'undefined' && token !== '') {
          const doctor = JSON.parse(await AsyncStorage.getItem('doctor'))
          if(doctor) {
           await setDoctorLocally(token, doctor);
            //console.log('user props is ' +  this.props);
            this.setState( {isAuthenticated : true});
          }
        }
      } catch (e) {
        console.log('Failed to Login User' + e);
      }     
  }
  

  render() {
      const { isAuthenticated }  = this.state;
      console.log('coming on Render');
      return (
      
        <Provider store={store} key="provider">
           <StyleProvider style={getTheme(material)}>
           
            {!isAuthenticated ? <RoutesLogin/> : <RoutesHome /> }  
           
           </StyleProvider>  
        </Provider>
      )
    }
  }
import React, { Component } from 'react';
import { Container, Text, Button, Icon } from 'native-base';
import { login, logout } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import styles from '../auth/styles'

class Mainpage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userEntry: '',
            password: ''
        }
    }

    doLogout() {
        logout();
        this.props.navigation.navigate('login');
    }  

    render() {
        return (


            <Container style={styles.container}>

              <Text> HEllo Text </Text>
              <Button primary onPress={() => this.doLogout() } >
              <Icon name='ios-home' />
              <Text>
                Logout
            </Text>
          </Button>  

               
            </Container>

        )
    }

}



function HomeState(state) {
    return {
        user: state.user
    }
}
export default connect(HomeState, { login })(Mainpage)

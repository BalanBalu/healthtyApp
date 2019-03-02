// Imports
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { View, Text, Image, CheckBox, TouchableHighlight, Icon } from 'react-native'
import { isEmail, isLength } from 'validator'
// UI Imports
import Button from '../../../ui/button/Button'
import InputText from '../../../ui/input/Text'
import styles from './styles'
import Body from '../../common/Body'

// App Imports
import config from '../../../setup/config'
import { login } from '../../user/api/actions'
import { messageShow, messageHide } from '../../common/api/actions'
import { ScrollView, ToolbarAndroid } from 'react-native-gesture-handler';

// Component
class Login extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      userentry: '',
      Password: ''
    }
  }

  onSubmitRegister = async () => {
    const { login, messageShow, messageHide } = this.props

    const user = {
      userentry: this.state.userentry,
      Password: this.state.Password
    }
    console.log(user);
    // Validate
    let error = false

    if (!isLength(user.Password, { min: 3 })) {
      messageShow('Password needs to be atleast 3 characters long. Please try again.')
      error = true
    }

    if (error) {
      setTimeout(() => {
        messageHide()
      }, config.message.error.timers.default)

      return false
    } else {
      try {
        await login(user)
      } catch (error) {
        messageShow(this.props.user.error)
      } finally {
        setTimeout(() => {
          messageHide()
        }, config.message.error.timers.long)
      }
    }
  }

  render() {
    const { userentry, Password } = this.state
    const { user: { isLoading } } = this.props

    return (


      <View style={styles.container}>

        <View style={styles.loginarea}>
          <Text style={styles.welcome}>Welcome</Text>
          <Image
            style={styles.logo}
            source={{ uri: 'data:image/jpeg;base64,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' }}
          />
          <View style={{ marginTop: 20 }}>
            <InputText style={styles.inputBox} underlineColorAndroid='transparent' placeholder={'Email or Phone'}></InputText>
          </View>

          <View style={{ marginTop: 10 }}>
            <InputText style={styles.inputBox} underlineColorAndroid='transparent' placeholder={'Password'}></InputText>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', marginTop: 10 }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start' }}>
              <CheckBox style={{ textAlign: 'left', }}></CheckBox>
              <Text style={{ marginTop: 5 }}>Remember me</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', textAlign: 'flex-end', marginTop: 5, marginLeft: 80 }}>
              <Text>Forgot Password</Text>
            </View>
          </View>

          <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onClickListener('login')}>
            <Text style={styles.loginText}>Sign In</Text>
          </TouchableHighlight>
          <View style={{ textAlign: 'center', marginTop: 10 }}>
            <Text>Dont have an account ? SignUp</Text>
          </View>
        </View>




      </View>




    )
  }
}

// Component Properties
Login.propTypes = {
  user: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  messageShow: PropTypes.func.isRequired,
  messageHide: PropTypes.func.isRequired
}



// Component State
function loginState(state) {
  return {
    user: state.user
  }
}

export default connect(loginState, { login, messageShow, messageHide })(Login)

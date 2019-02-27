// Imports
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { View, Text, CheckBox, Picker, DatePickerAndroid, TouchableOpacity,Image } from 'react-native'
import { isEmail, isLength } from 'validator'
import DatePicker from 'react-native-datepicker'

// UI Imports
import Button from '../../../ui/button/Button'
import InputText from '../../../ui/input/Text'
import styles from './styles'

// App Imports
import config from '../../../setup/config'
import { register } from '../../user/api/actions'
import { messageShow, messageHide } from '../../common/api/actions'
import { UIManager, findNodeHandle } from 'react-native';

// Component
class Signup extends PureComponent {
constructor(props) {
super(props)
this.state = { date: "2016-05-15" },
this.state = {

  isLoading: false,

  name: '',
  email: '',
  password: '',
  
}
}

loading = isLoading => {
this.setState({
isLoading
})
}

onSubmitRegister = async () => {
const { register, messageShow, messageHide } = this.props

const user = {
name: this.state.name,
email: this.state.email,
password: this.state.password
}

// Validate
let error = false

if (!isLength(user.name, { min: 3 })) {
messageShow('Name needs to be atleast 3 characters long. Please try again.')

error = true
} else if (!isEmail(user.email)) {
messageShow('The email you provided is invalid. Please try again.')

error = true
} else if (!isLength(user.password, { min: 3 })) {
messageShow('Password needs to be atleast 3 characters long. Please try again.')

error = true
}

if (error) {
setTimeout(() => {
  messageHide()
}, config.message.error.timers.default)

return false
} else {
const { onSuccessRegister } = this.props

this.loading(true)

messageShow('Signing you up, please wait...')

try {
  const response = await register(user)

  this.loading(false)

  if (response.data.errors && response.data.errors.length > 0) {
    messageShow(response.data.errors[0].message)
  } else {
    messageShow('Registered successfully. Please login.')

    onSuccessRegister()
  }
} catch (error) {
  this.loading(false)

  messageShow('There was some error signing you up. Please try again.')
} finally {
  setTimeout(() => {
    messageHide()
  }, config.message.error.timers.long)
}
}
}



_onPressButton() {
try {
const { action, year, month, day } = DatePickerAndroid.open({
  // Use `new Date()` for current date.
  // May 25 2020. Month 0 is January.
  date: new Date(2020, 4, 25)
});
if (action !== DatePickerAndroid.dismissedAction) {
  // Selected year, month (0-11), day
}
} catch ({ code, message }) {
console.warn('Cannot open date picker', message);
}
}

render() {
const { isLoading, name, email, password } = this.state

return (
<View style={styles.container}>

  <View style={{ flex: 1, flexDirection: 'row', height: 50, backgroundColor: '#9B65F0' }}>

    <Text style={styles.rightText}>Sign In</Text>
  </View>
  <View >

    <View style={styles.signuparea}>

      <View>
        <Text style={styles.name}>CREATE AN ACCOUNT</Text>
      </View>

      <View style={styles.errorMsg}>
      <Text> Your account has been created successfully</Text>
      </View>
      <View style={{ marginTop: 10 }}>

        <InputText placeholder={'UserName'}></InputText>
      </View>

      <View style={{ marginTop: 10 }}>

        <InputText placeholder={'Email  or Mobile'}></InputText>
      </View>

      <View style={{ marginTop: 10 }}>

        <InputText placeholder={'password'}></InputText>
      </View>

      <Picker
        selectedValue={this.state.language}
        style={{ height: 50, width: 320, marginTop: 10, borderColor: 'gray', borderWidth: 4 }}
        onValueChange={(itemValue, itemIndex) =>
          this.setState({ language: itemValue })
        }>
        <Picker.Item label="Java" value="Male" />
        <Picker.Item label="JavaScript" value="Female" />
      </Picker>


      <TouchableOpacity style={{flex:1,flexDirection:'row'}} onPress={this._onPressButton}>
        <Image source={{ uri: 'http://heritageacademyschools.org/wp-content/uploads/2017/06/heritage_image_2.png' }} style={{height:40,width:40}}/>
        <Text style={styles.custom}>DATE</Text>

      </TouchableOpacity>




{/* 
      <DatePicker
        style={{ width: 300, marginTop: 10 }}
        date={this.state.date}
        mode="date"
        placeholder="Date Of Birth"
        format="YYYY-MM-DD"
        minDate="2016-05-01"
        maxDate="2016-06-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36
          }
          
        }}
        onDateChange={(date) => { this.setState({ date: date }) }}
      /> */}

      <View style={{ flexDirection: 'column' }}>

        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <CheckBox
            value={this.state.checked}
            onValueChange={() => this.setState({ checked: !this.state.checked })}
          />
          <Text style={{ marginTop: 5 }}>I have read and accept medflics terms and conditions</Text>
        </View>
      </View>


      <View style={styles.buttonContainer}>
        <View style={styles.buttonContainerLeft} />

        <View style={styles.buttonContainerRight}>
          <Button
            title={'signUp'}
            iconLeft={'check'}
            theme={'primary'}
            disabled={isLoading}
            onPress={this.onSubmitRegister}
          />
        </View>
      </View>
    </View>

  </View>

  {/* <InputText
    placeholder={'Name'}
    returnKeyType={'next'}
    value={name}
    onChangeText={name => this.setState({ name })}
    autoFocus={true}
    blurOnSubmit={false}
    onSubmitEditing={() => {
      this.inputEmail.focus()
    }}
  />
  <InputText
    inputRef={input => {
      this.inputEmail = input
    }}
    placeholder={'Email'}
    keyboardType={'email-address'}
    autoCapitalize={'none'}
    returnKeyType={'next'}
    value={email}
    onChangeText={email => this.setState({ email })}
    blurOnSubmit={false}
    onSubmitEditing={() => {
      this.inputPassword.focus()
    }}
  />

  <InputText
    inputRef={input => {
      this.inputPassword = input
    }}
    placeholder={'Password'}
    secureTextEntry={true}
    returnKeyType={'go'}
    value={password}
    onChangeText={password => this.setState({ password })}
    onSubmitEditing={event => this.onSubmitRegister(event)}
  />

  <View style={styles.buttonContainer}>
    <View style={styles.buttonContainerLeft} />

    <View style={styles.buttonContainerRight}>
      <Button
        title={'Submit'}
        iconLeft={'check'}
        onPress={this.onSubmitRegister}
        theme={'primary'}
        disabled={isLoading}
      />
    </View>
  </View> */}
</View>
)
}
}

// Component Properties
Signup.propTypes = {
onSuccessRegister: PropTypes.func.isRequired,
register: PropTypes.func.isRequired,
messageShow: PropTypes.func.isRequired,
messageHide: PropTypes.func.isRequired
}

export default connect(null, { register, messageShow, messageHide })(Signup)

// Imports
import React, { PureComponent, Component } from 'react'
import { View } from 'react-native'
import { Container, Header, Content, Button, Text ,Form,Item,Input} from 'native-base';
// UI Imports
import styles from './styles'

// App Imports
import Body from '../../common/Body'
import ProductList from '../../product/List'

// Component
class WhatsNew extends Component {
  render() {
    return (
      <Container>
      <Content>
      <Item regular>
            <Input placeholder='Regular Textbox' onChangeText={(text) => console.log(text)} />
          </Item>
      </Content>
    </Container>
    )
  }
}

export default WhatsNew

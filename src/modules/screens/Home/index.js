// Imports
import React, { PureComponent } from 'react'
import { View, Text } from 'react-native'
import { ScrollView } from 'react-navigation'

// UI Imports
import ActionIcon from '../../../ui/icon/ActionIcon'
import styles from './styles'
import InputText from '../../../ui/input/Text'

// App Imports
import { routes } from '../../../setup/routes'
import { routesHome } from '../../../setup/routes/home'
import NavigationTop from '../../common/NavigationTop'
import Body from '../../common/Body'
import Intro from './Intro'
import HowItWorks from './HowItWorks'
import CollageMen from './Collage/Men'
import CollageWomen from './Collage/Women'
import { white } from '../../../ui/common/colors';

// Component
export default class Home extends PureComponent {

  getSubscription = () => {
    this.props.navigation.navigate(routes.crates.name)
  }

  render() {
    return (
      <Body>
        {/* <NavigationTop
          title="Qbakbak"
          rightIcon={
            <ActionIcon
              icon={'info-outline'}
              onPress={() => this.props.navigation.navigate(routesHome.info.name)}
            />
          }
        /> */}

        <ScrollView style={styles.container}>
          <View style={styles.bodyContainer}>
            <View style={{ backgroundColor: '#9E63EF' }}>
              <View style={{ backgroundColor: '#9E63EF', flex: 1, flexDirection: 'row' }}>

                <InputText style={styles.inputText} underlineColorAndroid="transparent" placeholder={'search'} ></InputText>
                <Text style={styles.rightText}>Filter</Text>

              </View>
              <Text style={{ color: white, fontSize: 12, marginLeft: 5, }}>medicine , alhocol, aspirin,aspirin..</Text>
            </View>


            <View style={styles.searcharea}>

              <View style={styles.errorMsg}>
                <Text> Your Keyword does not match</Text>
              </View>

            </View>



          </View>
        </ScrollView>
      </Body>
    )
  }
}

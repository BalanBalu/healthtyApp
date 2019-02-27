// Imports
import React, { PureComponent } from 'react'
import { View } from 'react-native'


// UI Imports
import { TabBar, TabContent } from '../../../../ui/tab'
import styles from './styles'

// App Imports
import Login from '../../../user/Login'
import Signup from '../../../user/Signup'

// Component
class PreLogin extends PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      tabActive: 'login'
    }
  }

  tabSelect = (tabActive) => {
    this.setState({
      tabActive
    })
  }

  onSuccessRegister = () => {
    this.setState({
      tabActive: 'login'
    })
  }

  render() {
    const { tabActive } = this.state

    return (
      <View style={styles.container}>
        {/* Hero section */}
        <View style={styles.heroContainer}>
          

          <TabBar
            active={tabActive}
            onSelect={this.tabSelect}
            items={[
              { title: 'Login', key: 'login' },
              { title: 'Signup', key: 'signup' }
            ]}
          />
        </View>

        <TabContent
          active={tabActive}
          items={{
            login: <Login />,
            signup: <Signup onSuccessRegister={this.onSuccessRegister} />
          }}
        />
      </View>
    )
  }
}

export default PreLogin

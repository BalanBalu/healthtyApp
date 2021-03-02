import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { setI18nConfig } from '../translator.helper';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {primaryColor} from '../../setup/config';

class LanguagePopUp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: null
    };
  }

  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = (index, language) => {
    this._menu.hide();
    this.setState({
      selectedIndex: index
    });
    switch (language) {
      case 'English':
        return  setI18nConfig('en');
      case 'Tamil':
        return setI18nConfig('ta');
        case 'Malayalam':
            return  setI18nConfig('ma');
    }
  };

  showMenu = () => {
    this._menu.show();
  }

  render() {
    const data = [{ listName: 'English'}, { listName: 'Tamil' },{ listName: 'Malayalam'}]
    const { selectedIndex } = this.state
    return (

      <View style={styles.mainView}>
        <Menu
          ref={this.setMenuRef}
          button={
            <TouchableOpacity activeOpacity={1} onPress={this.showMenu} style={styles.menuIcon}>
               <FontAwesome
            name='language' style={{ color: '#fff', fontSize: 22 }}></FontAwesome>
            </TouchableOpacity>
          }
        >
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) =>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <MenuItem
                  textStyle={selectedIndex === index ? { color: '#fff' } : {}}
                  underlayColor={'#e0e0e0'}
                  disabledTextColor={"#bdbdbd"}
                  raised={true}
                  selected
                  // backgroundColor='#F00'
                  style={
                    selectedIndex === index ? { backgroundColor: primaryColor, color: '#fff', } : {}
                  }
                  onPress={() => this.hideMenu(index,item.listName)}>
                  {item.listName}
                </MenuItem>
              </View>
            } />
        </Menu>
      </View>
    );
  }
}

export default LanguagePopUp;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  menuIcon: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
    paddingBottom: 5
  },
  rightArrowStyle: {
    fontSize: 25,
    marginTop: 12,
    position: 'absolute',
    right: 10,
    top: 0,
  },
})

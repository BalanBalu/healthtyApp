import React from 'react';

import { View, Text,TouchableOpacity } from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

class DropDownMenu extends React.PureComponent {
  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',marginRight:10 }}>
        <Menu
          ref={this.setMenuRef}
          button={
          <TouchableOpacity  onPress={this.showMenu} style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 5, paddingBottom: 5 }}>
          <MaterialIcons  name="more-vert" style={{ color: '#fff',fontSize:25 }}></MaterialIcons>
        </TouchableOpacity>
        }
        >
          <MenuItem onPress={this.hideMenu}>Close</MenuItem>
          <MenuDivider />
          <MenuItem onPress={this.hideMenu}>settings</MenuItem>
          {/* <MenuItem onPress={this.hideMenu} disabled>
            Menu item 3
          </MenuItem> */}
          {/* <MenuDivider /> */}
        </Menu>
      </View>
    );
  }
}

export default DropDownMenu;
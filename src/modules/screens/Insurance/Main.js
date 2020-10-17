import React, {useState, useEffect} from 'react';

import {
  List,
  ListItem,
  Text,
  Body,
  Container,
  Root,
  Content,
  View,
  Button,
} from 'native-base';
// import CheckBox from 'react-native-check-box'
import {StyleSheet, Image} from 'react-native';
import SelectionListHeader from './SelectionListHeader';
import {ScrollView} from 'react-native-gesture-handler';
// import { Checkbox } from 'react-native-paper';

const mockItems = [
  {
    id: '1',
    name: 'ICICI Lombard Health',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'
  },
  {
    id: '2',
    name: 'Star Health Insurance',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'
  },
  {
    id: '3',
    name: 'LIC Health Insurance',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'
  },
  {
    id: '4',
    name: 'Kotak Mahindra Health Insurance',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'
  },
  {
    id: '5',
    name: 'HDFC Ergo General Health Insurance',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'
  },
  {
    id: '6',
    name: 'IFFCO Tokio Health Insurance	',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'
  },
  {
    id: '7',
    name: 'HDFC Ergo General Health Insurance',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'
  },
  {
    id: '8',
    name: 'Aditya Birls Life Insurance',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'
  }
 
];


function useSelectionChange(items) {
  const [selectionMode, setSelectionMode] = useState(null);
  useEffect(() => {
    if (items.filter(i => i.selected).length > 0) {
      setSelectionMode(true);
    } else {
      setSelectionMode(false);
    }
  });
  return selectionMode;
}

function Main() {
  const [items, setItems] = useState(mockItems);
  const selectionMode = useSelectionChange(items);

  const toggleSelect = item => {
    setItems(
      items.map(i => {
        if (item === i) {
          i.selected = !i.selected;
        }
        return i;
      }),

    );
  };

  const clearSelection = () => {
    setItems(
      items.map(i => {
        i.selected = false;
        return i;
      }),
    );
  };

  const onPress = item => {
    if (!selectionMode) {
      toggleSelect(item);
      
    }
    if (selectionMode) {
      toggleSelect(item);
    } else {
      pressItem(item);
    }
  };

  const onLongPress = item => {
    // if (selectionMode === false) {
    //   toggleSelect(item);
    // }
    if (selectionMode === false) {
      toggleSelect(item);
    }
  };

  const pressItem = item => {
    console.log(JSON.stringify(item) + ' pressed');
  };
  

  const renderItem = item => {
    
    return (
      
      <ListItem
        onPress={() => onPress(item)}
        // onLongPress={() => onLongPress(item)}
        onLongPress={() => onLongPress(item)}
        key={item.id}
        style={[item.selected ? styles.selected : styles.normal]}>
        <Body>
        <Image source={require('./icici.png')}
        style={{width: 35, height: 35, borderRadius: 60/ 2, marginLeft: 30, marginTop: -10, marginBottom: 25}}
        />
          <Text style={{ color: '#4B5164', marginTop: -60, marginLeft: 80, fontWeight: 'bold' }}
          >{item.name}</Text>
          <Text style={{ marginLeft: 80, color: '#808090' }}
          >premium</Text>
          <Text style={{ color: '#AFAFAF', marginTop: 8 }}
          >{item.description}</Text>
         <Text style={{ color: '#775DA3', marginBottom: -10, marginTop: 50, }}
          >KNOW MORE</Text>
          
        </Body>
        {/* <CheckBox style={{ marginTop: -130 }}
         checked={false}        
         />
        */}
         
       
      </ListItem>
    );
  };

  return (
    <>
      <Root>
        <Container>
          <SelectionListHeader
            selectionMode={selectionMode}
            title="Insurance"
            selectedItemsCount={items.filter(i => i.selected).length}
            clearSelection={clearSelection}
            selectActions={[
              {
                name: 'Delete',
                method: function() {
                  clearSelection();
                },
              },
              {
                name: 'Cancel',
              },
            ]}
          />
          <Content>
            <View>
              <Text style={{marginTop: 10, marginBottom: 10, marginLeft: 30, marginRight: 10, fontSize: 20}}>
                Select Policies you want to enquire
              </Text>
            </View>
            <ScrollView
              style={{
                backgroundColor: '#fff',
                height: 600,
                elevation: 4,
                marginLeft: 10,
                marginRight: 5,
                borderRadius: 8,
              }}>
              <View
                style={{
                  elevation: 10,
                  marginLeft: 15,
                  marginRight: 15,
                }}>
                {/* {items.map(item => {
                  return renderItem(item);
                })} */}
                {items.map(item => {
                  return renderItem(item);
                })}
              </View>
            </ScrollView>
            <Button
              style={{
                marginTop: 20,
                backgroundColor: '#775DA3',
                marginLeft: 70,
                marginRight: 70,
                borderRadius: 5,
              }}>
              <Text style={{textAlign: 'center', marginLeft: 75}}>
                Get Quotes
              </Text>
            </Button>
          </Content>
        </Container>
      </Root>
    </>
  );
}

export default Main;

const styles = StyleSheet.create({
  selected: {
    height: 200,
    backgroundColor: '#ffffff',
    marginLeft: 5,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    // paddingLeft: 18,
    borderRadius: 6,
    marginTop: 5,
    marginBottom: 5,
    elevation: 5,
    borderColor: '#7F49C3',
  },
  normal: {
    height: 200,
    backgroundColor: '#ffffff',
    marginLeft: 5,
    // paddingLeft: 18,
    elevation: 5,
    borderRadius: 6,
    marginTop: 5,
    marginBottom: 5,
  },
});

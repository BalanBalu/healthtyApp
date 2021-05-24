import React, { PureComponent } from 'react';
import { Text, View, CheckBox } from 'native-base';
import { TouchableOpacity, FlatList, } from 'react-native'
import styles from '../Styles';




const DocumentSubmitted = ({ isSelected, ListOfData, checkBoxClick }) => {

    return (
        <View>
            <FlatList
                data={ListOfData}
                keyExtractor={(item, index) => index.toString()}
                extraData={checkBoxClick}
                renderItem={({ item, index }) => (
                    <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15, marginLeft: 10 }}>
                        <CheckBox style={{ borderRadius: 5, }}
                            checked={checkBoxClick === item.text}
                            onPress={() => this.setState({ checkBoxClick: item.text })}

                        />
                        <Text style={styles.flatlistText}>{item.text}</Text>
                    </View>
                )} />

            <View style={styles.ButtonView}>
                <TouchableOpacity style={styles.submit_ButtonStyle} >
                    <Text style={{ color: "#fff" }}>Submit And Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


export default DocumentSubmitted
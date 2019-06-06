import React from 'react';
import ContentLoader from './ContentLoader';
import { Circle, Rect } from 'react-native-svg'
import { Dimensions, View } from "react-native";
export const Loader = (props) => {
  if(props.style === 'profile') {
    return <ContentLoader height={Dimensions.get('window').height} width={Dimensions.get('window').width}>
        <Rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
        <Rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
        <Rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
        <Rect x="0" y="80" rx="3" ry="3" width="350" height="10" />
        <Rect x="0" y="100" rx="3" ry="3" width="200" height="10" />
        <Rect x="0" y="120" rx="3" ry="3" width="360" height={Dimensions.get('window').height} />
     </ContentLoader>
    }
    else if(props.style ==='insta') {
       return <ContentLoader height={Dimensions.get('window').height} width={Dimensions.get('window').width}>
         <Circle cx="30" cy="30" r="30" />
         <Rect x="75" y="13" rx="4" ry="4" width="100" height="13" />
         <Rect x="75" y="37" rx="4" ry="4" width="50" height="8" />
         <Rect x="10" y="70" rx="5" ry="5" width="600" height={Dimensions.get('window').height} />
       </ContentLoader>
    }
    else if(props.style === 'list') {
      console.log(Dimensions.get('window').height);
      let height = Dimensions.get('window').height;
      let width = Dimensions.get('window').width;
      noOfList = height / 100; 
      let array = [];
      for(let i = 0; i < noOfList; i++) {
        array.push( ( i * 100) + 35 )
      }
      return <ContentLoader height={Dimensions.get('window').height} 
                            width={Dimensions.get('window').width}>
                <Rect x="0" y="2" rx="3" ry="3" width={width} height="10" />
                <Rect x="0" y="20" rx="3" ry="3" width={width} height="10" />
              
            {array.map((start, key) => {
            return (
                <View key={key}>
                <Rect x="0" y={String(start)} rx="5" ry="5" width="70" height="70" />
                <Rect x="80" y={String(start + 17)} rx="4" ry="4" width="300" height="13" />
                <Rect x="80" y={String(start + 40)} rx="3" ry="3" width="250" height="10" />
                <Rect x="0" y={String(start + 80)} rx="3" ry="3" width="350" height="10" />
                </View>
             );
            })}                   
          
          
       </ContentLoader>
      }
      function fun(start) {
       
       return (
         <View>
          <Rect x="0" y={String(start)} rx="5" ry="5" width="70" height="70" />
          <Rect x="80" y={String(start + 17)} rx="4" ry="4" width="300" height="13" />
          <Rect x="80" y={String(start + 40)} rx="3" ry="3" width="250" height="10" />
          <Rect x="0" y={String(start + 80)} rx="3" ry="3" width="350" height="10" />
          </View>
          )
      }
}
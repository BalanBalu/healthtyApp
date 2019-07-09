import React from 'react';
import ContentLoader from './ContentLoader';
import { Circle, Rect } from 'react-native-svg'
import { Dimensions, View } from "react-native";
import {Content } from 'native-base';

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
    else if(props.style ==='appointment') {
       return <ContentLoader height={Dimensions.get('window').height} width={Dimensions.get('window').width}>
         
         <Circle x="45" y="53" cx="30" cy="50" r="50" />
         <Rect x="135" y="63" rx="4" ry="8" width="200" height="13" />
         <Rect x="135" y="87" rx="4" ry="4" width="200" height="8" />
         <Rect x="135" y="100" rx="4" ry="4" width="200" height="13" />

         <Rect x="40" y="180" rx="5" ry="5" width="300" height="20" />
         <Rect x="40" y="210" rx="5" ry="5" width="300" height="20" />
        
        
         <Rect x="10" y="280" rx="5" ry="5" width="600" height={Dimensions.get('window').height} />
       </ContentLoader>
    }
    else if(props.style ==='singleLine') {
      return <ContentLoader>
             <Rect x="0" y="0" rx="0" ry="0" width="300" height="20" />
         </ContentLoader>
     
    }
    else if(props.style === 'list') {
      
      let height = Dimensions.get('window').height;
      let width = Dimensions.get('window').width;
      noOfList = height / 100; 
      console.log(noOfList)
      let array = [];
      for(let i = 0; i < noOfList; i++) {
        array.push( ( i * 100) + 35 )
      }
     // console.log(array)
      return <ContentLoader height={Dimensions.get('window').height} 
                            width={Dimensions.get('window').width}>
                <Rect x="0" y="5" rx="3" ry="3" width={width} height="15" />
                <Rect x="0" y="25" rx="3" ry="3" width={width} height="15" />
                
            <Circle x="45" y="73" cx="30" cy="45" r="45" />
            <Rect x="135" y="70" rx="4" ry="8" width="200" height="13" />
            <Rect x="135" y="93" rx="4" ry="4" width="200" height="8" />
            <Rect x="135" y="110" rx="4" ry="4" width="200" height="13" />

            <Rect x="135" y="143" rx="4" ry="4" width="200" height="8" />
            <Rect x="135" y="160" rx="4" ry="4" width="200" height="8" />

            <Rect x="40" y="190" rx="5" ry="5" width="300" height="12" /> 
            <Rect x="40" y="210" rx="5" ry="5" width="300" height="12" />
            <Rect x="40" y="230" rx="5" ry="5" width="300" height="12" />
            

            <Rect x="40" y="270" rx="5" ry="5" width="300" height="20" /> 
            <Rect x="40" y="300" rx="5" ry="5" width="300" height="20" />


            <Circle x="45" y="373" cx="30" cy="45" r="45" />
            <Rect x="135" y="370" rx="4" ry="8" width="200" height="13" />
            <Rect x="135" y="393" rx="4" ry="4" width="200" height="8" />
            <Rect x="135" y="410" rx="4" ry="4" width="200" height="13" />

            <Rect x="135" y="443" rx="4" ry="4" width="200" height="8" />
            <Rect x="135" y="460" rx="4" ry="4" width="200" height="8" />

            <Rect x="40" y="490" rx="5" ry="5" width="300" height="12" /> 
            <Rect x="40" y="510" rx="5" ry="5" width="300" height="12" />
            <Rect x="40" y="530" rx="5" ry="5" width="300" height="12" />
            

            <Rect x="40" y="570" rx="5" ry="5" width="300" height="20" /> 
            <Rect x="40" y="600" rx="5" ry="5" width="300" height="20" />

            <Circle x="45" y="673" cx="30" cy="45" r="45" />
            <Rect x="135" y="670" rx="4" ry="8" width="200" height="13" />
            <Rect x="135" y="693" rx="4" ry="4" width="200" height="8" />
            <Rect x="135" y="710" rx="4" ry="4" width="200" height="13" />

            <Rect x="135" y="743" rx="4" ry="4" width="200" height="8" />
            <Rect x="135" y="760" rx="4" ry="4" width="200" height="8" />

            <Rect x="40" y="790" rx="5" ry="5" width="300" height="12" /> 
            <Rect x="40" y="810" rx="5" ry="5" width="300" height="12" />
            <Rect x="40" y="830" rx="5" ry="5" width="300" height="12" />
            

            <Rect x="40" y="870" rx="5" ry="5" width="300" height="20" /> 
            <Rect x="40" y="900" rx="5" ry="5" width="300" height="20" />
        </ContentLoader>
      }
      
}
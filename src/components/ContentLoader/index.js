import React from 'react';
import ContentLoader from './ContentLoader';
import { Circle, Rect, } from 'react-native-svg'
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
     
      let array = [];
      for(let i = 0; i < noOfList; i++) {
        array.push( ( i * 100) + 35 )
      }
     
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
      else if(props.style === 'smallList') {
      
        let height = Dimensions.get('window').height;
        let width = Dimensions.get('window').width;
        noOfList = height / 100; 
       
        let array = [];
        for(let i = 0; i < noOfList; i++) {
          array.push( ( i * 100) + 35 )
        }
       
        return <ContentLoader height={Dimensions.get('window').height} 
                              width={Dimensions.get('window').width}>
          <Rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
          <Rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
          <Rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
          <Rect x="0" y="80" rx="3" ry="3" width="350" height="10" />
          <Rect x="0" y="100" rx="3" ry="3" width="200" height="10" />
          <Rect x="0" y="100" rx="3" ry="3" width="350" height="10" />
          <Rect x="0" y="120" rx="3" ry="3" width="200" height="10" />
          <Rect x="0" y="120" rx="3" ry="3" width="350" height="10" />
          <Rect x="0" y="140" rx="3" ry="3" width="200" height="10" />
          <Rect x="0" y="140" rx="3" ry="3" width="350" height="10" />
          <Rect x="0" y="160" rx="3" ry="3" width="200" height="10" />
          <Rect x="0" y="160" rx="3" ry="3" width="350" height="10" />
          <Rect x="0" y="180" rx="3" ry="3" width="200" height="10" />
          <Rect x="0" y="180" rx="3" ry="3" width="350" height="10" />
          <Rect x="0" y="200" rx="3" ry="3" width="200" height="10" />
          <Rect x="0" y="200" rx="3" ry="3" width="350" height="10" />
          <Rect x="0" y="220" rx="3" ry="3" width="200" height="10" />
          <Rect x="0" y="220" rx="3" ry="3" width="350" height="10" />
          <Rect x="0" y="240" rx="3" ry="3" width="200" height="10" />
          </ContentLoader>
        }
        else if(props.style ==='smallLine') {
          return <ContentLoader height={10} 
          width={50}>
                <Rect x="48" y="8" rx="3" ry="3" width="88" height="6" /> 
                <Rect x="0" y="0" rx="0" ry="0" width="300" height="20" />

             </ContentLoader>
            
         
        }   
        else if(props.style === 'newList') {
      
          let height = Dimensions.get('window').height;
          let width = Dimensions.get('window').width;
          noOfList = height / 100; 
         
          let array = [];
          for(let i = 0; i < noOfList; i++) {
            array.push( ( i * 100) + 35 )
          }
         
          return <ContentLoader height={Dimensions.get('window').height} 
                                width={Dimensions.get('window').width}>
                  
                <Rect x="10" y="10" rx="4" ry="4" width="370" height="1" />

                <Rect x="40" y="30" rx="4" ry="4" width="300" height="10" />
                <Rect x="40" y="50" rx="4" ry="4" width="250" height="5" />

                <Rect x="10" y="75" rx="4" ry="4" width="370" height="1" />

                <Rect x="10" y="90" rx="4" ry="4" width="370" height="1" />

                <Rect x="40" y="110" rx="4" ry="4" width="300" height="10" />
                <Rect x="40" y="130" rx="4" ry="4" width="250" height="8" />

                <Rect x="10" y="155" rx="4" ry="4" width="370" height="1" />

                <Rect x="10" y="170" rx="4" ry="4" width="370" height="1" />
                

                <Rect x="40" y="190" rx="4" ry="4" width="300" height="10" />
                <Rect x="40" y="210" rx="4" ry="4" width="250" height="8" />

                <Rect x="10" y="235" rx="4" ry="4" width="370" height="1" />

                <Rect x="10" y="250" rx="4" ry="4" width="370" height="1" />

                <Rect x="40" y="270" rx="4" ry="4" width="300" height="10" />
                <Rect x="40" y="290" rx="4" ry="4" width="250" height="8" />

                <Rect x="10" y="315" rx="4" ry="4" width="370" height="1" />

                <Rect x="10" y="330" rx="4" ry="4" width="370" height="1" />

                <Rect x="40" y="350" rx="4" ry="4" width="300" height="10" />
                <Rect x="40" y="370" rx="4" ry="4" width="250" height="8" />

                <Rect x="10" y="395" rx="4" ry="4" width="370" height="1" />

                <Rect x="10" y="410" rx="4" ry="4" width="370" height="1" />

                <Rect x="40" y="430" rx="4" ry="4" width="300" height="10" />
                <Rect x="40" y="450" rx="4" ry="4" width="250" height="8" />

                <Rect x="10" y="475" rx="4" ry="4" width="370" height="1" />

                <Rect x="10" y="490" rx="4" ry="4" width="370" height="1" />

                <Rect x="40" y="510" rx="4" ry="4" width="300" height="10" />
                <Rect x="40" y="530" rx="4" ry="4" width="250" height="8" />

                <Rect x="10" y="555" rx="4" ry="4" width="370" height="1" />

                <Rect x="10" y="570" rx="4" ry="4" width="370" height="1" />

                <Rect x="40" y="590" rx="4" ry="4" width="300" height="10" />
                <Rect x="40" y="610" rx="4" ry="4" width="250" height="8" />

                <Rect x="10" y="635" rx="4" ry="4" width="370" height="1" />

                <Rect x="10" y="650" rx="4" ry="4" width="370" height="1" />

                <Rect x="40" y="670" rx="4" ry="4" width="300" height="10" />
                <Rect x="40" y="690" rx="4" ry="4" width="250" height="8" />
               
            </ContentLoader>
          }
          else if(props.style === 'familyList') {
      
            let height = Dimensions.get('window').height;
            let width = Dimensions.get('window').width;
            noOfList = height / 100; 
           
            let array = [];
            for(let i = 0; i < noOfList; i++) {
              array.push( ( i * 100) + 35 )
            }
           
            return <ContentLoader height={Dimensions.get('window').height} 
                                  width={Dimensions.get('window').width}>

                  <Rect x="10" y="60" rx="4" ry="4" width="370" height="3" />
                  <Rect x="40" y="90" rx="4" ry="4" width="300" height="10" />
                  <Rect x="40" y="120" rx="4" ry="4" width="250" height="8" />
                  <Rect x="20" y="150" rx="4" ry="4" width="350" height="1" />
                  <Rect x="40" y="175" rx="4" ry="4" width="300" height="8" />
                  <Rect x="10" y="200" rx="4" ry="4" width="370" height="3" />

                  <Rect x="10" y="215" rx="4" ry="4" width="370" height="3" />
                  <Rect x="40" y="245" rx="4" ry="4" width="300" height="10" />
                  <Rect x="40" y="275" rx="4" ry="4" width="250" height="8" />
                  <Rect x="20" y="295" rx="4" ry="4" width="350" height="1" />
                  <Rect x="40" y="320" rx="4" ry="4" width="300" height="8" />
                  <Rect x="10" y="345" rx="4" ry="4" width="370" height="3" />

                  <Rect x="10" y="360" rx="4" ry="4" width="370" height="3" />
                  <Rect x="40" y="390" rx="4" ry="4" width="300" height="10" />
                  <Rect x="40" y="420" rx="4" ry="4" width="250" height="8" />
                  <Rect x="20" y="450" rx="4" ry="4" width="350" height="1" />
                  <Rect x="40" y="475" rx="4" ry="4" width="300" height="8" />
                  <Rect x="10" y="500" rx="4" ry="4" width="370" height="3" />

                  <Rect x="10" y="515" rx="4" ry="4" width="370" height="3" />
                  <Rect x="40" y="545" rx="4" ry="4" width="300" height="10" />
                  <Rect x="40" y="575" rx="4" ry="4" width="250" height="8" />
                  <Rect x="20" y="605" rx="4" ry="4" width="350" height="1" />
                   <Rect x="40" y="630" rx="4" ry="4" width="300" height="8" />
                  <Rect x="10" y="655" rx="4" ry="4" width="370" height="3" />

                  <Rect x="10" y="670" rx="4" ry="4" width="370" height="3" />
                  <Rect x="40" y="700" rx="4" ry="4" width="300" height="10" />
                  <Rect x="40" y="730" rx="4" ry="4" width="250" height="8" />
                  <Rect x="20" y="760" rx="4" ry="4" width="350" height="1" />
                   <Rect x="40" y="785" rx="4" ry="4" width="300" height="8" />
                  <Rect x="10" y="810" rx="4" ry="4" width="370" height="3" /> 
                  </ContentLoader>
          }
          else if(props.style === 'boxList') {
      
            let height = Dimensions.get('window').height;
            let width = Dimensions.get('window').width;
            noOfList = height / 100; 
           
            let array = [];
            for(let i = 0; i < noOfList; i++) {
              array.push( ( i * 100) + 35 )
            }
           
            return <ContentLoader height={Dimensions.get('window').height} 
                                  width={Dimensions.get('window').width}>
                                    <Rect x="10" y="20" rx="10" ry="10" width="370" height="35" /> 

                  <Rect x="10" y="80" rx="15" ry="15" width="110" height="110" />
                  <Rect x="135" y="80" rx="15" ry="15" width="110" height="110" />
                  <Rect x="260" y="80" rx="15" ry="15" width="110" height="110" />

                  <Rect x="10" y="210" rx="15" ry="15" width="110" height="110" />
                  <Rect x="135" y="210" rx="15" ry="15" width="110" height="110" />
                  <Rect x="260" y="210" rx="15" ry="15" width="110" height="110" />

                  <Rect x="10" y="340" rx="15" ry="15" width="110" height="110" />
                  <Rect x="135" y="340" rx="15" ry="15" width="110" height="110" />
                  <Rect x="260" y="340" rx="15" ry="15" width="110" height="110" />

                  <Rect x="10" y="470" rx="15" ry="15" width="110" height="110" />
                  <Rect x="135" y="470" rx="15" ry="15" width="110" height="110" />
                  <Rect x="260" y="470" rx="15" ry="15" width="110" height="110" />

                  <Rect x="10" y="600" rx="15" ry="15" width="110" height="110" />
                  <Rect x="135" y="600" rx="15" ry="15" width="110" height="110" />
                  <Rect x="260" y="600" rx="15" ry="15" width="110" height="110" />
                 
                  </ContentLoader>
          }

          
      
}
      
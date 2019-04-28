import React from 'react';
import ContentLoader from './ContentLoader';
import { Circle, Rect } from 'react-native-svg'
import { Dimensions } from "react-native";
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
}
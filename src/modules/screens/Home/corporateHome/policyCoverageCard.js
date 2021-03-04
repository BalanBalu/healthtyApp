import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';
import { primaryColor, secondaryColor } from '../../../../setup/config'
import { CircleProgessImage } from './svgDrawings';
import styles from './styles'
import { Col, Row, Grid } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { formatDate } from '../../../../setup/helpers';
import { AnimatedCircularProgress } from 'react-native-circular-progress';


export const PolicyCoverageCard = props => {
    const { navigation, data } = props;
    const percentageCalculation =(total,balance)=>{
        if(total !=0){
            let percentage = (balance/total) * (100);
            return percentage
        }else {
            return 0;
        }

    }
    return (
        <TouchableHighlight activeOpacity={0.6}
            underlayColor="#fff" >
            <View
                style={{
                    marginTop: 6,
                    flex: 1,
                }}>
                <View
                    style={{
                        backgroundColor: primaryColor,
                        minHeight: 135,
                        borderRadius: 22,
                        marginTop: 0,
                        marginBottom: 20,
                        marginHorizontal: 10,
                        position: 'relative',
                        flex: 1,
                    }}>
                    <View
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            marginLeft: 20,
                            marginTop: 15,
                        }}>
                        <Text
                            style={{
                                color: '#fff',
                                fontFamily: 'OpenSans',
                                fontSize: 18,
                                fontWeight: '700',
                            }}>
                            {data.firstName ? (data.firstName + ' ' + data.lastName) : '-'}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                            
                            <Text
                                style={{
                                    color: '#fff',
                                    fontFamily: 'OpenSans',
                                    fontSize: 12,
                                     lineHeight: 20,
                                    fontWeight: 'bold'
                                }}>{data.policyNo ? data.policyNo : '-'}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text 
                                style={{
                                    color: '#fff',
                                    fontFamily: 'OpenSans',
                                    fontSize: 12,
                                     lineHeight: 20,

                                }}>Valid Upto</Text>
                            <Text
                                style={{
                                    color: '#fff',
                                    fontFamily: 'OpenSans',
                                    fontSize: 12,
                                     lineHeight: 20,
                                    marginLeft: 5,
                                    fontWeight: 'bold',
                                 
                                }}>{formatDate(data.policyEffectiveTo, "DD/YYYY")}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                          
                          <Text numberOfLines={1}
                              style={{
                                  color: 'rgba(255,255,255, 0.9)',
                                  fontFamily: 'OpenSans',
                                  fontSize: 12,
                                  lineHeight: 24,
                                  fontWeight: 'bold',
                                  width:'45%',
                                  fontStyle:'italic'
                              }}>{data.insuranceCompany ? data.insuranceCompany : '-'}</Text>
                      </View>
                        <View style={{ flexDirection: 'row' }}>
                          
                            <Text numberOfLines={1}
                                style={{
                                    color: 'rgba(255,255,255, 0.9)',
                                    fontFamily: 'OpenSans',
                                    fontSize: 12,
                                    lineHeight: 20,
                                    fontWeight: 'bold',
                                    width:'45%',
                                    fontStyle:'italic'
                                }}>{data.corporateName ? data.corporateName : '-'}</Text>
                        </View>
                       
                        
                       
                    </View>

                    <View style={{ position: 'absolute', top: 0, right: -11.5 }}>
                        <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="192.099"
                            height="135.165"
                            viewBox="0 0 194.099 155.165">
                            <Path
                                id="Path_5183"
                                data-name="Path 5183"
                                d="M731.328,89.558V193.773c0,14.069-8.41,25.475-18.785,25.475H537.229c1.332-15.262,8.316-59.808,44.717-75.579,44.213-19.141,38.56-79.586,38.56-79.586h92.037C722.917,64.083,731.328,75.489,731.328,89.558Z"
                                transform="translate(-537.229 -64.083)"
                                fill="#b1d9d9"
                            />
                        </Svg>
                    </View>
                    <View style={{position:'absolute',right:15,top:15}}>
                    <AnimatedCircularProgress
                size={80}
                width={7}
                // fill={10}
                fill={percentageCalculation(data.sumInsured,data.balSumInsured)}
                tintColor={primaryColor}
                backgroundColor='rgba(18, 130, 131, 0.3)'>
                {() => (
                  <View>
                     <Text
                                style={{
                                    color: '#000',
                                    fontFamily: 'OpenSans',
                                    fontSize: 11,
                                    lineHeight: 24,
                                    textAlign: 'center',
                                    marginTop: 15
                                }}>{data.sumInsured ? data.sumInsured : 0}</Text>
                            <Text
                                style={{
                                    color: '#000',
                                    fontFamily: 'OpenSans',
                                    fontSize: 10,
                                    lineHeight: 24,
                                    textAlign: 'center',
                                    marginTop: -5

                                }}>SI</Text>
                  </View>
                )}
              </AnimatedCircularProgress>
              <Row style={{position:'absolute',right:60,top:65 }}>
                        <Col>
                            <Text
                                style={{
                                    color: '#000',
                                    fontFamily: 'OpenSans',
                                    fontSize: 11,
                                    lineHeight: 24,
                                    marginLeft: 5,

                                    textAlign: 'center',
                                    marginTop: 8
                                }}>{data.balSumInsured ? data.balSumInsured : 0}</Text>
                            <Text
                                style={{
                                    color: '#128283',
                                    fontFamily: 'OpenSans',
                                    fontSize: 10,
                                    lineHeight: 24,
                                    textAlign: 'center',
                                    marginTop: -5,
                                    fontWeight: '700',

                                }}>Balance SI</Text>
                        </Col>
                    </Row>
                    </View>
                   
                </View>
            </View>
        </TouchableHighlight>
    );
};

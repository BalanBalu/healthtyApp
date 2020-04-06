import React, { Component } from 'react';
import { View, Text, AsyncStorage, Platform } from "react-native";
import { dateDiff, getMoment, formatDate } from '../../../setup/helpers'


export function medicineRateAfterOffer(item) {
  let amount = ''
  if (item.discount_value == undefined) {
    amount = parseInt(item.price)
  }
  if (item.discount_type) {
    if (item.discount_type == 'PERCENTAGE') {
      let divided = (parseInt(item.discount_value) / 100) * parseInt(item.price)
      amount = parseInt(item.price) - divided
      return amount
    } else if (item.discount_type == 'AMOUNT') {
      amount = parseInt(item.price) - parseInt(item.discount_value);
      return amount
    }
  } else {
    return amount
  }
}


export async function ProductIncrementDecreMent(quantity, price, operation, threshold_limits) {

  let itemQuantity = (quantity === undefined ? 0 : quantity);
  let totalAmount = price;
  let threshold_message = null;
  let threshold_limit = threshold_limits || itemQuantity + 1
  if (operation === "add") {

    if (itemQuantity < threshold_limit) {
      quantity = ++itemQuantity;
      totalAmount = quantity * price
    } else {

      threshold_message = 'you will not add more than' + threshold_limit

    }

  } else {
    if (quantity > 1) {
      quantity = --itemQuantity;
      totalAmount = quantity * price
    }
  }
  if (Number.isInteger(totalAmount) === false) {
    let temp = Number(totalAmount).toFixed(2)
    return {
      quantity: quantity,
      totalAmount: Number(temp),
      threshold_message: threshold_message
    }
  }
  return {
    quantity: quantity,
    totalAmount: Number(totalAmount),
    threshold_message: threshold_message
  }
}


export function renderMedicineImage(data) {
  console.log(data)
  let source = require('../../../../assets/images/paracetamol.jpg')
  if (data.medicine_images) {
    if (data.medicine_images[0]) {
      console.log(data.medicine_images[0].imageURL)
      source = { uri: data.medicine_images[0].imageURL }
    }
  }
  return (source)
}
export async function relativeTimeView(review_date) {
  try {
    console.log(review_date)
    var postedDate = review_date;
    var currentDate = new Date();
    var relativeDate = dateDiff(postedDate, currentDate, 'days');
    if (relativeDate > 30) {
      return formatDate(review_date, "DD-MM-YYYY")
    } else {
      return getMoment(review_date, "YYYYMMDD").fromNow();
    }
  }
  catch (e) {
    console.log(e)
  }
}

export async function setCartItemCountOnNavigation(navigation) {
  const userId = await AsyncStorage.getItem('userId')
  if (userId) {
    let cart = await AsyncStorage.getItem('cartItems-' + userId) || [];
    let cartData = []
    if (cart.length != 0) {
      cartData = JSON.parse(cart)
    }
    navigation.setParams({
      cartItemsCount: cartData.length
    });
  }
}

export function getAddress(location) {
  if (!location) return ''
  if (location)
    return `${location.address.no_and_street},${location.address.address_line_1 || ''} ${location.address.city}, ${location.address.state}, ${location.address.pin_code}`;
  else
    return ''
}
export function getKiloMeterCalculation(gpsLocation, pharmacyLocation) {
  console.log(gpsLocation)
  if (gpsLocation !== undefined && pharmacyLocation !== undefined) {

    // let narthCorinate = ;
    // let eastCorinate =;
    squareNarthCorinate = Math.pow((gpsLocation[0] - pharmacyLocation[0]), 2);
    squareeastCorinate = Math.pow((gpsLocation[1] - pharmacyLocation[1]), 2)
    add = squareNarthCorinate + squareeastCorinate
    let km = Math.sqrt(add).toFixed(1) + ' Km'
    return km

  }
  else {
    return '0 km '
  }

}



export const renderAppoinmentData = (props) => {

  return (
    <View style={{ borderBottomColor: '#DCDCDC', borderBottomWidth: 0.5, paddingBottom: 5 }}>
      <ScrollView
        horizontal={true}
        style={{ marginTop: 5 }}
        showsHorizontalScrollIndicator={false}
      >
        <FlatList
          data={data}
          extraData={this.state}
          horizontal={true}
          onEndReached={this.onScrollHandler}
          onEndThreshold={0}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) =>
            <Card
              style={{ padding: 10, borderRadius: 2, borderBottomWidth: 2, }}>
              <Grid onPress={() => this.props.navigation.navigate('PatientInfo', { data: item })}>
                <Row>
                  <Col size={2}>
                    <Thumbnail circle source={RenderProfileImage(item.userInfo)} style={{ height: 50, width: 50 }} />

                  </Col>
                  <Col size={8} style={{ marginLeft: 10 }}>

                    <Text style={styles.nameText}>{getName(item.userInfo)}</Text>

                    <Text note style={styles.diseaseText}>{getUserGenderAndAge(item.userInfo) + "," + item.disease_description}</Text>

                    <Text style={styles.locationText}>{getHospitalHeadeName(item.location)}</Text>

                  </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Icon name="md-calendar" style={{ fontSize: 15, color: '#775DA3' }} />
                    <Text style={styles.dateText}>{formatDate(item.appointment_starttime, 'DD/MM/YYYY')}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                    <Icon name="md-clock" style={{ fontSize: 15, color: '#775DA3' }} />
                    <Text style={styles.dateText}>`{formatDate(item.appointment_starttime, 'hh:mm A')} - {formatDate(item.appointment_endtime, 'hh:mm A')}`</Text>
                  </View>

                </Row>
              </Grid>
            </Card>
          } />
        <Row style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 10 }} >
          <TouchableOpacity onPress={() => this.props.navigation.navigate("Appointments", { makeActiveTab: activeTab })} style={{ alignItems: 'center', borderRadius: 1500 / 2, backgroundColor: '#F3EBF8', paddingLeft: 5, paddingRight: 5, paddingTop: 25, paddingBottom: 25 }}>
            <Text style={styles.moredataText}>View All </Text>
            <Text style={styles.moredataText}>Appointments</Text>
          </TouchableOpacity>
        </Row>
      </ScrollView>
    </View>

  )
}

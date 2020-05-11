import React, { Component } from 'react';
import { View, Text, AsyncStorage, Platform } from "react-native";
import { dateDiff, getMoment, formatDate } from '../../../setup/helpers'


export function medicineRateAfterOffer(item) {


  let amount = ''//for binding purpose used empty string
  if (item === undefined) {
    return amount
  }
  if (item.discount_value === undefined) {

    amount = parseInt(item.price)
    return amount
  }
  if (item.discount_type) {

    if (item.discount_type === 'PERCENTAGE') {
      let divided = (parseInt(item.discount_value) / 100) * parseInt(item.price)
      amount = parseInt(item.price) - divided
      return amount
    } else if (item.discount_type === 'AMOUNT') {
      amount = parseInt(item.price) - parseInt(item.discount_value);
      return amount
    }
  }
  else {
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

      threshold_message = `You can't add more than  ${String(threshold_limit)} items`

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
  if (data) {
    if (data.medicine_images) {
      if (data.medicine_images[0]) {
        console.log(data.medicine_images[0].imageURL)
        source = { uri: data.medicine_images[0].imageURL }
      }
    }
  }
  return (source)
}
export function renderMedicineImageAnimation(data) {


  let source = require('../../../../assets/images/paracetamol.jpg')
  if (data) {
    source = { uri: data.imageURL }
  }
  return (source)
}
export function renderMedicineImageView(data) {


  let source = require('../../../../assets/images/paracetamol.jpg')
  if (data) {
    source = { uri: data }
  }
  return (source)
}
export function renderPrescriptionImageAnimation(data) {


  let source = require('../../../../assets/images/paracetamol.jpg')
  if (data) {
    source = { uri: data.prescription_path }
  }
  return (source)
}
export function renderPharmacyImage(data) {
  let source = require('../../../../assets/images/apollopharmacy.jpeg')
  if (data) {
    source = { uri: data.imageURL }
  }
  return source
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
    let result = getDistanceFromLatLonInKm(gpsLocation[0], gpsLocation[1], pharmacyLocation[0], pharmacyLocation[1])

    return result.toFixed(1) + ' Km'
    // squareNarthCorinate = Math.pow((gpsLocation[0] - pharmacyLocation[0]), 2);
    // squareeastCorinate = Math.pow((gpsLocation[1] - pharmacyLocation[1]), 2)
    // add = squareNarthCorinate + squareeastCorinate
    // let km = Math.sqrt(add).toFixed(1) + ' Km'
    // return km

  }
  else {
    return '0 km '
  }

}
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  let R = 6371; // Radius of the earth in km
  let dLat = deg2rad(lat2 - lat1);  // deg2rad below
  let dLon = deg2rad(lon2 - lon1);
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

export function getMedicineName(data) {
  let medicineName = ' '
  if (!data) {
    return medicineName
  }
  if (data) {
    medicineName = `${(data.medicine_name || '') + ' ' + (data.medicine_dose || '') + ' ' + (data.medicine_unit || '')}`;
    return medicineName
  }
  else {
    return medicineName
  }

}
export function getMedicineWeightUnit(weight, unit) {
  let medicineWeightUnit = ' '
  if (!weight && !unit) {
    return medicineWeightUnit
  }
  if (weight && weight) {
    medicineWeightUnit = `${'(' + (weight || '') + ' ' + (unit || '') + ' )'}`;
    return medicineWeightUnit
  }
  else {
    return medicineWeightUnit
  }
}

export function quantityPriceSort(data) {
  data.forEach(element => {
    if (element.medPharDetailInfo) {
      if (element.medPharDetailInfo.variations) {

        element.medPharDetailInfo.variations.sort(function (firstVarlue, secandValue) {


          if (firstVarlue.total_quantity === 0) return 1;
          else if (secandValue.total_quantity === 0) return -1;
          else return firstVarlue.price - secandValue.price;
        });

      }
    }
  })
  return data
}


export const statusBar = {

  "PENDING":
  {
    status: 'Ordered and Approved',
    checked: true,
    color: 'red'
  },
  "APPROVED":
  {
    status: 'Packed and Out for Delivery',
    checked: true,
    color: 'green'
  },
  "CANCELED":
  {
    status: 'Canceled the order',
    checked: true,
    color: 'red'
  },
  "REJECTED":
  {
    status: 'Rejected  the order',
    checked: true,
    color: 'red'
  },
  "OUT_FOR_DELIVERY":
    { status: 'Order is on the way',
     checked: true ,
    color:'green'},
  "READY_FOR_DELIVERY":
    { status: 'The order is ready for delivery',
     checked: true,
     color:'green'
     },
  "DELIVERED":
    { status: 'The order is delivered', 
    checked: true,
    color:'green' },
  "null":
    { status: 'status  mismatching',
     checked: true ,
     color:'red'
    },
  "FAILED":
    { status: 'order is failed try again',
     checked: true ,
     color:'green'
    },
}


export function getName(data) {
  let name = 'unKnown'
  if (data) {
      if (data.first_name != undefined || data.last_name != undefined) {
          name = `${data.first_name || ''} ${data.last_name || ''}`

      }
  }
  return name

}
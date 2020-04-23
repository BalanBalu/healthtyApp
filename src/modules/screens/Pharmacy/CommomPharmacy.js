import React, { Component } from 'react';
import { View, Text, AsyncStorage, Platform } from "react-native";
import { dateDiff, getMoment, formatDate } from '../../../setup/helpers'


export function medicineRateAfterOffer(item) {
  

  let amount = ''//for binding purpose used empty string
  if(item===undefined){
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

      threshold_message = 'you will not add more than' + String(threshold_limit)

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
  let source =  require('../../../../assets/images/paracetamol.jpg')
  if (data.medicine_images) {
    if (data.medicine_images[0]) {
      console.log(data.medicine_images[0].imageURL)
      source = { uri: data.medicine_images[0].imageURL }
    }
  }
  return (source)
}
export function renderMedicineImageAnimation(data) {
 
 
  let source =  require('../../../../assets/images/paracetamol.jpg')
  if (data) {
      source = { uri: data.imageURL }
  }
  return (source)
}
export function renderPrescriptionImageAnimation(data) {
 
 
  let source =  require('../../../../assets/images/paracetamol.jpg')
  if (data) {
      source = { uri: data.prescription_path }
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
    medicineWeightUnit = `${'('+(weight || '') + ' ' + (unit || '') + ' )'}`;
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
                
               
                    if(firstVarlue.total_quantity === 0) return 1;
                    else if(secandValue.total_quantity === 0) return -1;
                    else return firstVarlue.price - secandValue.price;
                });
               
        }
    }
})
return data
}


export const statusBar = {

  "PENDING":
  
    { status: 'Ordered and Approved', checked: true, drawLine: true },
 
 

  "APPROVED": 
  { status: 'Packed and Out for Delivery', checked: false, },
  
  "CANCELED": 
    { status: 'Canceled the order', checked: true, drawLine: true },

  

}
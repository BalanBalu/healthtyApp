import React, { Component } from 'react';
import { View, Text, AsyncStorage, Platform } from "react-native";






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


export async function ProductIncrementDecreMent(quantity, price, operation) {

    let itemQuantity, totalAmount = price;
    if (operation === "add") {
        itemQuantity = (quantity == undefined ? 0 : quantity);
        quantity = ++itemQuantity;
        totalAmount = quantity * price

    } else {
        if (quantity > 1) {
            itemQuantity = quantity;
            quantity = --itemQuantity;
            totalAmount = quantity * price
        }
    }
    return {
        quantity: quantity,
        totalAmount: totalAmount
    }
}


export function renderMedicineImage(data) {
    let source = require('../../../../assets/images/paracetamol.jpg')
    if (data.medcine_image) {
        if(data.medcine_image[0]){
            console.log(data.medcine_image[0].imageURL)
            source = { uri: data.medcine_image[0].imageURL }
        }  
    } 
    return (source)
}
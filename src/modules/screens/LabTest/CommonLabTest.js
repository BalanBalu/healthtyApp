import React, { Component } from "react";
import { View, Text, Platform } from "react-native";
import { dateDiff, formatDate, addTimeUnit } from '../../../setup/helpers';


export function getUserGenderAndAge(data) {
    let genderAndAge = '';
    if (data) {
        if (data.gender) {
            if (data.gender === 'M') {
                genderAndAge = '(Male)'
            }
            else if (data.gender === 'F') {
                genderAndAge = '(Female)'
            }
            else if (data.gender === 'O') {
                genderAndAge = '(Others)'
            }
        }
    }
    return genderAndAge;
}

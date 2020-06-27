import RNCalendarEvents from "react-native-calendar-events";

import React, { Component } from "react";
import { Text, View, Button, Alert,BackHandler } from "react-native";
export async function getCalendarStatus(){
    try {
      let calendarAuthStatus = await RNCalendarEvents.authorizationStatus();
      console.log("Calendar Status" )
      console.log(calendarAuthStatus)
    //   Alert.alert("Calendar Status", calendarAuthStatus, [{text:"OK" ,onPress: () => BackHandler.exitApp()} ]);
    } catch (error) {
        alert(error)
    //   Alert.alert("Failed to get Calendar Status");
    }
  };

  
    export async function requestCalendarPermissions(){
    try {
      let requestCalendarPermission = await RNCalendarEvents.authorizeEventStore();
      Alert.alert("Calendar Permission", requestCalendarPermission, ["OK"]);
    } catch (error) {
      Alert.alert("Failed to ask permission");
    }
  };


    export async function getCalendars(){
    try {
      let availableCalendars = await RNCalendarEvents.findCalendars();
      Alert.alert("Available Calendars", JSON.stringify(availableCalendars), [
        "OK"
      ]);
    } catch (error) {
      Alert.alert("Failed to ask permission");
    }
  };

 
    export async function fetchAllEvents(){
    try {
      let allEvents = await RNCalendarEvents.fetchAllEvents(
        "2019-01-19T19:26:00.000Z",
        "2019-02-19T19:26:00.000Z"
      );
      console.log(allEvents);
      Alert.alert("Available Events", JSON.stringify(allEvents));
    } catch (error) {
      Alert.alert("Failed to get events");
    }
  };
  export async function saveEvent(title, details, options){
  let result=await RNCalendarEvents.saveEvent(title, details, options);
  return result
  }
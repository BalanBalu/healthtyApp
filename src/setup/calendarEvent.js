import RNCalendarEvents from "react-native-calendar-events";

import React, { Component } from "react";
import { Text, View, Button, Alert,BackHandler, AsyncStorage } from "react-native";
const CALENDERID = 'calenderId';
export async function createCalendar() {
 const result = await requestCalendarPermissions();
 if(result ==='authorized') {
    const calendars = await RNCalendarEvents.findCalendars();
    const medflicCalendar = calendars.find(ele => ele.title === 'MEDFLIC'); 
    if(medflicCalendar) {
        await AsyncStorage.setItem(CALENDERID, medflicCalendar.id);
        return medflicCalendar.id;
    }
    if(!medflicCalendar) {   
      const calendar = {
        title : 'MEDFLIC',
        color: 'green',
        entityType: 'event',
        name: 'MEDFLIC',
        accessLevel: 'read',
        ownerAccount: 'sathishkrish20@gmail.com',
        source: {
          name: 'MEDFLIC',
          type: 'event'
        }
    }
      const result = await RNCalendarEvents.saveCalendar(calendar);
      await AsyncStorage.setItem(CALENDERID, result);
      return result;
    }
  }
}

  export async function requestCalendarPermissions() {
    try {
      let requestCalendarPermission = await RNCalendarEvents.authorizeEventStore();
      console.log('Calendar Permission Granted');
      return requestCalendarPermission;
    } catch (error) {
      Alert.alert("Medflic Need your Calendar Permission to Store your Apppointments");
      return false;
    }
  };
 

  export async function saveEvent(title, startDate, endDate, location,  description, options){
    let calendarId = await AsyncStorage.getItem(CALENDERID);
    if(!calendarId) {
      calendarId = await createCalendar();
    }
    const details = {
      calendarId: calendarId,
      title: title,
      location: location,
      notes: description,
      description: description,
      startDate: startDate,  // ISO Format
      endDate: endDate // ISO format
    }
    let result = await RNCalendarEvents.saveEvent(title, details, options);
    return result;
  }

  export async function updateEvent(id, title, startDate, endDate, location,  description, options){
    const event = await RNCalendarEvents.findEventById(id);
    if(!event) {
      let result = await saveEvent();
      return result;
    } else {
       console.log('Event found ', event);
       let calendarId = await AsyncStorage.getItem(CALENDERID);
      if(!calendarId) {
        calendarId = await createCalendar();
      }
      const details = {
        id: id,
        calendarId: calendarId,
        title: title,
        location: location,
        notes: description,
        description: description,
        startDate: startDate,  // ISO Format
        endDate: endDate // ISO format
      }
      let result = await RNCalendarEvents.saveEvent(title, details, options);
      return result;
    }
  }
  export async function reomveEvent(id){
    const event = await RNCalendarEvents.findEventById(id);
    if(event) {
      let result = await RNCalendarEvents.removeEvent(id);
      return result;
    }
    return null; 
  }

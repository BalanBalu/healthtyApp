import RNCalendarEvents from "react-native-calendar-events";

import { Text, View, Button, Alert, BackHandler, AsyncStorage } from "react-native";
const CALENDERID = 'calenderId';
import { CURRENT_APP_NAME } from "../setup/config";
/*
    1. SaveEvent when User Creates an Appointment → (providers/bookappointment.js) and update the EventId on DB as node called “user_calender_event_id“
    2. UpdateEvent When user Approves the “PostPoned Appointment”)
    3. RemoveEvent when User Reject the “PostPoned Appointment” or Cancel the Appointment
*/
export async function createCalendar() {
  const result = await requestCalendarPermissions();
  if (result === 'authorized') {
    const calendars = await RNCalendarEvents.findCalendars();
    const medflicCalendar = calendars.find(ele => ele.title === 'MEDFLIC');
    if (medflicCalendar) {
      await AsyncStorage.setItem(CALENDERID, medflicCalendar.id);
      return medflicCalendar.id;
    }
    if (!medflicCalendar) {
      const calendar = {
        title: 'MEDFLIC',
        color: 'green',
        entityType: 'event',
        name: 'MEDFLIC',
        accessLevel: 'read',
        ownerAccount: 'medflic',
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
    Alert.alert(CURRENT_APP_NAME + " Need your Calendar Permission to Store your Apppointments");
    return false;
  }
};


export async function saveEvent(title, startDate, endDate, location, description, options) {
  let calendarId = await AsyncStorage.getItem(CALENDERID);
  if (!calendarId) {
    calendarId = await createCalendar();
  }
  let details = {
    calendarId: calendarId,
    title: title,
    location: location,
    notes: description,
    description: description,
    startDate: startDate,  // ISO Format
    endDate: endDate // ISO format
  }

  let result = await RNCalendarEvents.saveEvent(title, details);
  return result;
}

export async function updateEvent(id, title, startDate, endDate, location, description, options) {
  const event = await RNCalendarEvents.findEventById(id);
  let calendarId = await AsyncStorage.getItem(CALENDERID);

  if (!calendarId) {
    calendarId = await createCalendar();
  }
  let details = {
    calendarId: calendarId,
    title: title,
    location: location,
    notes: description,
    description: description,
    startDate: startDate,  // ISO Format
    endDate: endDate // ISO format
  }

  if (!event) {
    let result = await saveEvent(title, details);
    return result;
  } else {
    console.log('Event found ', event);

    details.id = id
    let result = await RNCalendarEvents.saveEvent(title, details);
    return result;
  }
}
export async function reomveEvent(id) {
  const event = await RNCalendarEvents.findEventById(id);
  if (event) {
    let result = await RNCalendarEvents.removeEvent(id);
    return result;
  }
  return null;
}

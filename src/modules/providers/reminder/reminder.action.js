import { getService, putService } from '../../../setup/services/httpservices';
export const SET_REMINDER_DATA = 'REMINDER/SET_REMINDER_DATA';
import { store } from '../../../setup/store';
import NoftifService from '../../../setup/NotifService';
import moment from 'moment';
import { formatDate } from '../../../setup/helpers';
import { CURRENT_APP_NAME } from "../../../setup/config";
export async function addReminderdata(userId, data) {
  try {

    let endPoint = 'reminder/medicines/user/' + userId;
    
    let response = await putService(endPoint, data);
    
    let respData = response.data;
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

export async function getReminderData(userId) {
  let respData = {
    success: false,
    message: '',
    data: []
  };
  try {
    let endPoint = 'reminder/medicines/user/' + userId;
  
    let response = await getService(endPoint);
    respData = response.data;
    return respData;
  } catch (e) {

    return {
      message: 'exception' + e,
      success: false
    }
  } finally {
    storeOnProp(respData);
    NoftifService.cancelAll();
    if (respData.data && respData.data.length > 0) {
      //  sheudleNotificationForAddReminders(respData.data);
    }
  }
}

export function sheudleNotificationForAddReminders(reminders) {
  reminders.forEach(element => {
    if (element.reminder_type === 'onlyonce') {
      let reminderDate = new Date(element.medicine_take_start_date);
      iterateThroughMedinceTimesByDay(element, reminderDate)
    } else {
      const startDate = moment(element.medicine_take_start_date);
      const endDate = moment(element.medicine_take_end_date);
      if (moment().isBetween(startDate, endDate)) {
        iterateThroughMedinceTimesByDay(element, new Date())
      }
    }
  });

}

function iterateThroughMedinceTimesByDay(element, reminderDate) {

  for (let index = 0; index < element.medicine_take_times.length; index++) {
    const medicineTakeTimeData = element.medicine_take_times[index];
    let reminderTime = new Date(medicineTakeTimeData.medicine_take_time);
    const notificatationDateTime = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate(), reminderTime.getHours(), reminderTime.getMinutes(), reminderTime.getSeconds() || 0);
    if (notificatationDateTime.getTime() >= new Date().getTime() && element.is_reminder_enabled === true) {
      const subText = CURRENT_APP_NAME + ': Medicine Reminder ' + element.medicine_name;
      const bigText = `Reminder to take Medicine ${element.medicine_strength} ${element.medicine_form} ${element.medicine_name} at ${formatDate(notificatationDateTime, 'hh:mm A')}`
      NoftifService.scheduleNotif(subText, bigText, notificatationDateTime)
    }
  }
}

const enumerateDaysBetweenDates = function (startDate, endDate) {
  var now = startDate.clone();
  let dates = [];
  while (now.isSameOrBefore(endDate)) {
    dates.push(new Date(moment(now).toDate()));
    now = now.add(1, 'day');
  }
  return dates;
};
function storeOnProp(reminderResp) {
  store.dispatch({
    type: SET_REMINDER_DATA,
    data: reminderResp
  });
}

export function addReminderOnProp(reminderData) {
  const { reminder: { reminderResponse } } = store.getState();
  if (reminderResponse.data) {
    const updatedReminderRespData = reminderResponse.data;
    updatedReminderRespData.unshift(reminderData);
    reminderResponse.data = updatedReminderRespData;
    storeOnProp(reminderResponse);
  }
}

export async function getAllMedicineDataBySuggestion(keyword) {
  try {
    let endPoint = '/reminder/medicines/suggestion/' + keyword;
    let response = await getService(endPoint);
    let respData = response.data;
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}
export const POSSIBLE_VIDEO_CONSULTING_STATUS = {
    PAYMENT_IN_PROGRESS :'PAYMENT_IN_PROGRESS',
    FAILED: 'FAILED',
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    CANCELED: 'CANCELED',
    CLOSED: 'CLOSED'
  }

  export const STATUS_VALUE_DATA = {
    PENDING: {
      text: 'Waiting for the Doctor\'s Approval',
      statusText: 'Pending',
      color: 'red',
      icon: 'ios-information-circle-outline',
      type: 'DOCTOR_REPORT_ISSUE_APPOINTMENT_PENDING'
    },
    APPROVED: {
      text: 'Video Consultaion Confirmed',
      statusText: 'Approved',
      color: 'green',
      icon: 'checkmark-circle',
      type: 'DOCTOR_REPORT_ISSUE_APPOINTMENT_APPROVED',
    },
    COMPLETED: {
      text: 'Video Consultation Resolved/ Completed',
      statusText: 'Completed',
      color: 'green',
      icon: 'checkmark-circle',
      type: 'DOCTOR_REPORT_ISSUE_APPOINTMENT_COMPLETED'
    },
    CLOSED: {
      text: 'No Response',
      statusText: 'Closed',
      color: '#d43640',
      icon: 'ios-close-circle',
      type: 'DOCTOR_REPORT_ISSUE_APPOINTMENT_CANCELED'
      // icon: 'closecircleo'
    },
    CANCELED: {
      text: 'Video Consultation Cancelled',
      statusText: 'Canceled',
      color: '#d43640',
      icon: 'ios-close-circle',
      type: 'DOCTOR_REPORT_ISSUE_APPOINTMENT_CANCELED'
    },
    REJECTED: {
      text: 'Video Consultation Rejected',
      statusText: 'Rejected',
      color: '#d43640',
      icon: 'ios-close-circle',
      type: 'DOCTOR_REPORT_ISSUE_APPOINTMENT_CANCELED'
    },
    PAYMENT_IN_PROGRESS: {
        text: 'Payment is not yet completed',
        statusText: 'Payment In Progress',
        color: '#d43640',
        icon: 'ios-sync',
        type: 'DOCTOR_REPORT_ISSUE_APPOINTMENT_CANCELED'
      }
  }
  
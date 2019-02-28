
import React ,{ PureComponent } from 'react';
import PropTypes from "prop-types";
import {DatePickerAndroid,TimePickerAndroid } from 'react-native';

class CustomDatePickerAndroid extends PureComponent {
  constructor(props) {
    super(props);
    this._showDatePickerAndroid = this._showDatePickerAndroid.bind(this);
  }
  
  static propTypes = {
    date: PropTypes.instanceOf(Date),
    mode: PropTypes.oneOf(["date", "time", "datetime"]),
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    is24Hour: PropTypes.bool,
    isVisible: PropTypes.bool,
    dateMode: PropTypes.oneOf(["calendar", "spinner", "default"]),
    timeMode: PropTypes.oneOf(["clock", "spinner", "default"]),
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date)
  };

  static defaultProps = {
    dateMode: 'calendar',
    timeMode : 'clock',
    minuteInterval: 1,
    isVisible : false,
    is24Hour : false,
    mode : 'datetime'
    //minDate : new Date()
  };
  
  componentDidUpdate = prevProps => {
    if (!prevProps.isVisible && this.props.isVisible) {
      if (this.props.mode === "date" || this.props.mode === "datetime") {
        this._showDatePickerAndroid().catch(console.error);
      } else {
        this._showTimePickerAndroid().catch(console.error);
      }
    }
  };
  componentDidMount = () => {
    
    if (this.props && this.props.isVisible) {
      if (this.props.mode === "date" || this.props.mode === "datetime") {
        this._showDatePickerAndroid().catch(console.error);    
      } else {
         this._showTimePickerAndroid().catch(console.error);
      }
    }
  };

  
   _showDatePickerAndroid = async () => {
    
    let picked;
     console.log(this.props);
     try {
         picked = await DatePickerAndroid.open({
         date: new Date(),
         //minDate: this.props.minimumDate,
         //maxDate: this.props.maximumDate,
         mode: this.props.dateMode
       });
    } catch ({ message }) {
       console.warn("Cannot open date picker", message);
       return;
     }
     const { action, year, month, day } = picked;
     if (action !== DatePickerAndroid.dismissedAction) {
       let date;
       date = new Date(year, month, day);
        
      if (this.props.mode === "datetime") {
         let pickedTime;
         try {
           pickedTime = await this._showTimePickerAndroid(date) // TimePickerAndroid.open(timeOptions);
         } catch ({ message }) {
           console.warn("Cannot open time picker", message);
           return;
         }
      } else {
        this.props.onConfirm(date);
      }
    } else {
        this.props.onCancel();
    }
  }
   
  _showTimePickerAndroid = async (pickedDate) => {
     let picked;
     try {
      picked = await TimePickerAndroid.open({
         hour:12,
         minute: 30,
         is24Hour: this.props.is24Hour,
         mode: this.props.timeMode
       });
     } catch ({ message }) {
       console.warn("Cannot open time picker", message);
       return;
     }
     let dateTime;
     const { action, hour, minute } = picked;
    if (action !== TimePickerAndroid.dismissedAction) {
        if(pickedDate) {
           let year = pickedDate.getFullYear();
           let month = pickedDate.getMonth();
           let day = pickedDate.getDate();
           dateTime = new Date(year, month, day, hour, minute);  
        } else {
            let currentDate = new Date();
            dateTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hour, minute ); //.setHours(hour).setMinutes(minute);
        }
            this.props.onConfirm(dateTime);
    } else {
            this.props.onCancel();
    }
  };

  
 /* render(props) {
    console.log(props);
    const { date, mode, onConfirm, onHideAfterConfirm, is24Hour, datePickerModeAndroid, minimumDate, maximumDate } = props;
    return (
      <TouchableOpacity style={{flex:1,flexDirection:'row'}} onPress={_showDatePickerAndroid(props)}>
      <Image source={{ uri: 'http://heritageacademyschools.org/wp-content/uploads/2017/06/heritage_image_2.png' }} style={{height:40,width:40}}/>
      <Text>DATE</Text>
     </TouchableOpacity>
    )
  } */

  render = () => {
     return (
      null
    )
   
  }

}
export default CustomDatePickerAndroid;
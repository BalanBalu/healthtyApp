// Helpers
import moment from 'moment';
// Render element or component by provided condition
export function renderIf(condition, renderFn) {
  return condition ? renderFn() : null
}

// Substring with ...
export function subString(string, length = 0) {
  return string.length > length ? `${string.substr(0, length)}...` : string
}

// Duplicate object
export function duplicate(object) {
  return Object.assign({}, object)
}

// Return empty string if value is null
export function nullToEmptyString(value) {
  return value === null ? '' : value
}

// Return zero if value is null
export function nullToZero(value) {
  return value === null ? 0 : value
}

// Add (s) to any string by count
export function plural(value) {
  return value === 1 ? '' : 's'
}

// Check if object is empty
export function isEmpty(obj) {
  let name;
  for (name in obj) {
    if (obj.hasOwnProperty(name)) {
      return false;
    }
  }
  return true;
}

// Slug
export function slug(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    //.replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '')            // Trim - from end of text
}

// Routing
export function getRoutesForStack(routes) {
  return Object.values(routes).reduce((result, route) => {
    result[route.name] = route
    return result
  }, {})
}

export function formatDate(date, format) {
  return moment(date).format(format || 'YYYY-MM-DD HH:mm:ss');
}
export function dateDiff(pastDate, futureDate, unitOfTime) {
  return moment(futureDate).diff(pastDate, unitOfTime);
}

export function getFirstDay(date, unit, format) {
  return moment(date).startOf(unit).format(format);
}
export function getLastDay(date, unit, format) {
  return moment(date).endOf(unit).format(format);
}
export function addMoment(date, amount, unit) {
  return moment(date).add(amount, unit)
}
export function subMoment(date, amount, unit) {
  return moment(date).add(amount, unit)
}

export function addTimeUnit(date, amount, unit) {
  return moment(date).add(amount, unit).toDate();
}
export function subTimeUnit(date, amount, unit) {
  return moment(date).subtract(amount, unit).toDate();
}

export function getMoment(date) {
  return moment(date)
}
export function findArrayObj(array, findNode, findValue) {
  let returnObj;
  //console.log(findValue);
  for (let i = 0; i < array.length; i++) {
    if (array[i][findNode] === findValue) {
      returnObj = array[i];
      break
    }
  }
  return returnObj;
}

/* Get Unique Values from Array  */
export function getUniqueValues(array) {
  var uniqueLanguageArray = [];
  for (i = 0; i < array.length; i++) {
    if (uniqueLanguageArray.indexOf(array[i]) === -1) {
      uniqueLanguageArray.push(array[i]);
    }
  }
  return uniqueLanguageArray;
}

export function intersection() {
  var result = [];
  var lists;

  if (arguments.length === 1) {
    lists = arguments[0];
  } else {
    lists = arguments;
  }
  console.log(lists);
  for (var i = 0; i < lists.length; i++) {
    var currentList = lists[i];
    for (var y = 0; y < currentList.length; y++) {
      var currentValue = currentList[y];
      if (result.indexOf(currentValue) === -1) {
        var existsInAll = true;
        for (var x = 0; x < lists.length; x++) {
          if (lists[x].indexOf(currentValue) === -1) {
            existsInAll = false;
            break;
          }
        }
        if (existsInAll) {
          result.push(currentValue);
        }
      }
    }
  }
  return result;
}

export function isOnlyLetter(inputtxt) {
   var letters = /^[A-Za-z, ]+$/;
   if(!inputtxt) return  false;
   if(inputtxt.match(letters)) {
      return true;
   } else {
     return false;
   }
}


export function getAllId(data) {

let dataIds =[];
 data.map((element, index) => {
 if( !dataIds.includes(element.doctor_id)){
  dataIds.push( element.doctor_id)
 }
  
  
})
let value=dataIds.join(",");

return value

}

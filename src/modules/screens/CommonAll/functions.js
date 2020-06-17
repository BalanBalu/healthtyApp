
import { getUnixTimeStamp, dateDiff, getMoment } from '../../../setup/helpers';

function getUserGenderAndAge(data) {
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


const reducer = (total, currentValue, currentIndex, originalArry) => {
    if (!currentValue.isSlotBooked) {
        return 1 + total;
    }
    else if (originalArry.length - 1 === currentIndex) {
        return total == 0 ? 'No' : total;
    }
    else {
        return total
    }
}

const sortByStartTime = (a, b) => {
    let startTimeSortA = getUnixTimeStamp(a.slotStartDateAndTime);
    let startTimeSortB = getUnixTimeStamp(b.slotStartDateAndTime);
    return startTimeSortA - startTimeSortB;
}


const enumerateStartToEndDates = (startDateByMoment, endDateByMoment, datesArry) => {
    let startDate = startDateByMoment.clone();
    // const datesArry = [];
    while (startDate.isSameOrBefore(endDateByMoment)) {
        datesArry.push(startDate.format('YYYY-MM-DD'));
        startDate = startDate.add(1, 'day');
    }
    return datesArry
}

function sortByPrimeDoctors(a, b) {
    if (a.isPrimeDoctorOnNormalCardView == true || b.isPrimeDoctorOnNormalCardView) {
        return 1;
    }
}
const calculateDoctorUpdatedExperience = (experience) => {
    const updatedDate = getMoment(experience.updated_date);
    let getDocExpInMonthsByUpToDate = dateDiff(updatedDate, getMoment(new Date()), 'months');
    let expInMonthsByUpdated = (experience.year * 12) + experience.month
    let expInMonths = getDocExpInMonthsByUpToDate + expInMonthsByUpdated;
    return {
        month: expInMonths % 12,
        year: parseInt(expInMonths / 12),
        isPrivate: experience.isPrivate
    };
}
export {
    getUserGenderAndAge,
    enumerateStartToEndDates,
    sortByStartTime,
    reducer,
    sortByPrimeDoctors,
    calculateDoctorUpdatedExperience
}

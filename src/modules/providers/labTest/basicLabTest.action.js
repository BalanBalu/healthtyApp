import { postService, getService, putService } from '../../../setup/services/httpservices';

export const searchByLabDetailsService = async (inputData) => {
    try {
        const endPoint = 'lab-test/user/search/labCategories';
        const response = await postService(endPoint, inputData);
        const respData = response.data;
        return respData;
    } catch (ex) {
        return {
            success: false,
            message: `Error Occurred on :${ex.message}`
        }
    }
}

export async function fetchLabTestAvailabilitySlotsService(labIds, dateFilter) {
    try {
        const endPoint = 'lab-test/availabilitySlots?startDate=' + dateFilter.startDate + '&endDate=' + dateFilter.endDate;
        const response = await postService(endPoint, labIds);
        const respData = response.data;
        return respData;
    } catch (ex) {
        return {
            success: false,
            message: `Error Occurred on :${ex.message}`
        }
    }
}

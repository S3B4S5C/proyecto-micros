import moment from "moment";

export const parseDate = (date) => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
}

export const getToday = () => {
    const now = new Date();
    return moment(now, 'YYYY-DD-MM h:mm:ss A').format('YYYY-MM-DD');
}

export const getNow = () => {
    const now = new Date();
    return moment(now, 'YYYY-DD-MM h:mm:ss A').format('HH:mm:ss');
}
import moment from "moment";

export const parseDate = (date) => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
}

export const getToday = () => {
    const now = new Date();
    return moment(now).format('YYYY-MM-DD');
}

export const getNow = () => {
    const now = new Date();
    return moment(now).format('HH:mm:ss');
}
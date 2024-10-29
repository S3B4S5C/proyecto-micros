export const parseDate = (date) => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
}

export const getToday = () => {
    const today = new Date();
    return parseDate(today.toLocaleDateString());
}

export const getNow = () => {
    const now = new Date();
    return now.toLocaleTimeString();
}
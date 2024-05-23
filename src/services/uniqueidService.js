import moment from "moment-timezone";

export const generateUniqueUserName = async (role, getLastUser) => {
    const currentYear = moment().format('YYYY');
    const currentDate = moment();
    let yearForm;
    const aprilFirst = moment(`${currentYear}-04-01`, 'YYYY-MM-DD');

    if (currentDate.isBefore(aprilFirst)) {
        yearForm = moment().subtract(1, 'year').format('YY') + moment().format('YY');
    } else if (currentDate.isAfter(aprilFirst)) {
        yearForm = moment().format('YY') + moment().add(1, 'year').format('YY');
    } else {
        yearForm = moment().format('YY') + moment().add(1, 'year').format('YY');
    }

    let prefix;
    if (role === 'TeamLeader') {
        prefix = 'TL'; // Prefix for Team leader
    } else if (role === 'Telecaller') {
        prefix = 'TC'; // Prefix for Tele caller
    } else {
        prefix = 'USR'; // Default prefix for other roles
    }

    let finalUserName;
    if (getLastUser && Array.isArray(getLastUser) && getLastUser.length !== 0) {
        const lastUser = getLastUser[0]; // Since we're fetching only the last user, we access the first element directly
        const lastUserName = lastUser.UserName; // Get the UserName of the last user
        const lastUserIdNumber = parseInt(lastUserName.split('-').pop(), 10); // Extract the number part and convert to integer
        const newNumber = lastUserIdNumber + 1; // Increment the number part

        finalUserName = `${prefix}-${yearForm}-${String(newNumber).padStart(3, '0')}`;
    } else {
        finalUserName = `${prefix}-${yearForm}-001`;
    }
    return finalUserName;
};
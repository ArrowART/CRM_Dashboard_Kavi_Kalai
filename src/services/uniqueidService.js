import moment from "moment-timezone";

export const generateUniqueUserName = async (role, lastUsers) => {
  const currentYear = moment().format('YYYY');
  const currentDate = moment();
  const aprilFirst = moment(`${currentYear}-04-01`, 'YYYY-MM-DD');

  let yearForm;
  if (currentDate.isBefore(aprilFirst)) {
    yearForm = moment().subtract(1, 'year').format('YY') + moment().format('YY');
  } else {
    yearForm = moment().format('YY') + moment().add(1, 'year').format('YY');
  }

  let prefix;
  if (role === 'TeamLeader') {
    prefix = 'TL';
  } else if (role === 'Telecaller') {
    prefix = 'TC';
  } else {
    prefix = 'USR';
  }

  let finalUserName;
  if (lastUsers && Array.isArray(lastUsers) && lastUsers.length !== 0) {
    const lastUser = lastUsers[0];
    const lastUserName = lastUser.UserName || `${prefix}-${yearForm}-000`;
    const lastUserIdNumber = parseInt(lastUserName.split('-').pop(), 10);
    const newNumber = lastUserIdNumber + 1;

    finalUserName = `${prefix}-${yearForm}-${String(newNumber).padStart(3, '0')}`;
  } else {
    finalUserName = `${prefix}-${yearForm}-001`;
  }

  return finalUserName;
};

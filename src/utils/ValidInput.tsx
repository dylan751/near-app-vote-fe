export const validateEmail = (mail: string) => {
  if (!mail) return { state: true, message: 'Is not empty!' };
  const mailformat = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
  const checkMail = mail.match(mailformat);
  if (!checkMail) return { state: true, message: 'Invalid email!' };
  else return { state: false, message: null };
};
export const validateNearAddress = (nearAccount: string) => {
  if (!nearAccount) return { state: true, message: 'Is not empty!' };
  else return { state: false, message: null };
};

export const validateUserName = (userName: string) => {
  if (!userName) return { state: true, message: 'Is not empty!' };
  else return { state: false, message: null };
};

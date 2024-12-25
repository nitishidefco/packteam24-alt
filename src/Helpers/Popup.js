const errorToast = message => {
  global._alert && global._alert.show(message);
};

const successToast = message => {
  global._alert && global._alert.show(message);
};

const infoToast = message => {
  global._alert && global._alert.show(message);
};

const success = (message) => {
  global._dropdownAlert && global._dropdownAlert.alertWithType('success', 'Success', message);
}

const warn = (message) => {
  global._dropdownAlert && global._dropdownAlert.alertWithType('warn', 'Oops', message);
}

const error = (message) => {
  global._dropdownAlert && global._dropdownAlert.alertWithType('error', 'Oops', message);
}

export default {
  errorToast,
  successToast,
  infoToast,
  success,
  warn,
  error
};


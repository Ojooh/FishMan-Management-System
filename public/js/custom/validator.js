import {
    isEmpty, validateName, validateUsername, validateAge, validateNamey, validateEmail, validateTel,
    validFBLink, validIGLink, validtwitterLink, validFutureDate, validGreaterDate, validYTLink, isImage,
    validatePass

} from './helper.js'

const validateLogin = (userDetails) => {
    if (isEmpty(userDetails.username) || ((validateUsername(userDetails.username) == false) && (validateEmail(userDetails.username) == false))) {
        return [null, false, { message: 'Username Input is not Valid' }];
    }
    else if (isEmpty(userDetails.pass) || validatePass(userDetails.pass) == false) {
        return [null, false, { message: 'Password Input is not Valid' }];
    }
    else {
        return [null, true, { message: 'User Profile is Valid' }];
    }

};

export { validateLogin }
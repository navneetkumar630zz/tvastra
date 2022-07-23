// init code
const { check } = require("express-validator");

// validation and sanitization
const checkValidation_onSignup = [
    check("name").not().isEmpty().trim().escape(),
    check("email").not().isEmpty().trim().normalizeEmail(),
    check("password").not().isEmpty().matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{8,}$/),
    check("mobile").not().isEmpty().trim().isMobilePhone()
];
const checkValidation_onLogin = [
    check("email").not().isEmpty().trim().normalizeEmail(),
    check("password").not().isEmpty()
];
const checkValidation_onResetPassword = [
    check("newPassword").not().isEmpty().matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{8,}$/),
    check("confirmPassword").not().isEmpty()
];
const checkValidation_onChangePassword = [
    check("currentPassword").not().isEmpty(),
    check("newPassword").not().isEmpty().matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{8,}$/),
    check("confirmPassword").not().isEmpty()
]

// exports module
module.exports = {
    signup: checkValidation_onSignup,
    login: checkValidation_onLogin,
    resetPassword: checkValidation_onResetPassword,
    changePassword: checkValidation_onChangePassword
}
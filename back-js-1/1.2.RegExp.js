const Validator = {
    /** RegExp rules to validation */
    rules: {
        email: new RegExp(
            "^" + // line begin
                "[a-z0-9]" + // first char always number or letter (1 time)
                "[a-z0-9-.+]{1,19}" + // letters or/and numbers or/and symbols -.+ (1 to 19 times)
                "@" + // symbol @ always (1 time)
                "[a-z0-9.!$%&’*+/=?^_-]{1,15}" + // letters or/and numbers or/and sybols .!$%&’*+/=?^_- (1 to 15 times)
                "\." + // symbol . always (1 time)
                "[a-z]{1,5}" + // letters only (1 to 5 times)
            "$", // line end
            "mi" // flag "m" Multiline, flag "i" Case-insensitive
        ),
        phone: new RegExp(
            "^(" + // line begin & begin global group (for one match)
                "([\\-\\s])*" + // can contains whitespaces or - at start
                "([\\+][\\d][\\d])?" + // can contains country code, in special format +NN only, one time only
                "(" + // begin mobile operator code group
                    "(\\(+[\\d][\\-|\\s]*[\\d][\\-|\\s]*[\\d]\\)+)" + // 2 brackets, 3 digits, can contains whitespaces or -
                    "|" + // or
                    "([\\d][\\-|\\s]*[\\d][\\-|\\s]*[\\d])" + // without brackets, 3 digits, can contains whitespaces or -
                ")" + // end mobile operator code group
                "([\\s\\-]*[\\d])" + // phone number 1 of 7 digits, can contains whitespaces or -
                "([\\s\\-]*[\\d])" + // 2
                "([\\s\-]*[\\d])" + // 3
                "([\\s\\-]*[\\d])" + // 4
                "([\\s\\-]*[\\d])" + // 5
                "([\\s\\-]*[\\d])" + // 6
                "([\\s\\-]*[\\d])" + // 7
                "([\\s\\-])*" + // can end with an infinite number of spaces or -
            ")$", // end global group & line end
            "mi" // flag "m" Multiline, flag "i" Case-insensitive
        ),
        password: new RegExp(
            "^" + // line begin
                "(?=.*[0-9].*)" + // contains at least one number
                "(?=.*[a-z].*)" + // contains at least one lowercase letter
                "(?=.*[A-Z].*)" + // contains at least one uppercase letter
                "(?=\\w{8,})" + // contains at least 8 symbols [A-Za-z0-9]
                "(\\w*)" + // only symbols A-Za-z0-9 and _ are allowed
            "$", // line end
            "mi" // flag "m" Multiline, flag "i" Case-insensitive
        ),
    },

    /** Check if input string matches email regex */
    validateEmail: function (email) {
        return this.rules.email.test(email)
    },

    /** Check if input string matches phone regex and string length */
    validatePhone: function (phone) {
        return this.rules.phone.test(phone) && phone.length > 0 && phone.length <= 25
    },

    /** Check input string contains matches regular expression password */
    validatePassword: function (password) {
        return this.rules.password.test(password)
    }
}
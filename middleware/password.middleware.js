const passwordValidator = require("password-validator");

const passwordShema = new passwordValidator();

passwordShema
    .is().min(5)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Azerty', 'Password', 'Password123']);

module.exports = (req, res, next) => {
    if (passwordShema.validate(req.body.password)) {
        next();
    }
    else {
        return  res
            .status(400).json({error : 'le mot de passe doit contenir minimun 5 caractères, deux majuscules et des chiffres'});
    }
}
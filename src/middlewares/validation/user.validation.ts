import { body } from "express-validator";
import { validator } from "./validator";

export const userValidation = [
  body("name")
    .isAlpha()
    .withMessage("name can not contian numbers or special characters"),

  // body("profile_pic")
  //   .exists({ checkFalsy: true })
  //   .withMessage("Profile picture can not be empty"),


  body("email").isEmail().withMessage("email is not valid"),

  body("password")
    .isStrongPassword()
    .withMessage(
      "Password must contain at least one number, one special character, small, and capital letters"
    ),

  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }

      // Indicates the success of this synchronous custom validator
      return true;
    }),

  validator,
];

export const loginValidation = [
  body("email").isEmail().withMessage("Email is not valid"),
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("password can not be empty"),
  validator,
];

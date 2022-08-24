import { body, query } from "express-validator";
import { NoteTypes } from "../../interfaces/NoteTypes";
import { validator } from "./validator";

export const noteValidation = [
  // body("userId").isUUID().withMessage("userId must be a uuid"),

  body("title")
    .isString()
    .withMessage("Note title can not be empty"),

  body("body")
    .isString()
    .withMessage("Note body can not be empty"),

  body("email")
    .isEmail()
    .withMessage("reciever email must be a valid email"),

  body("type")
    .custom((value: string, { req }) => {
      if (!(value?.toLocaleUpperCase() in NoteTypes)) {
        throw new Error('Note type is not valid');
      }

      // Indicates the success of this synchronous custom validator
      return true;
    }),


  validator,
];


export const notePaginationValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than 1"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("limit must be greater than 1"),



  validator,
]

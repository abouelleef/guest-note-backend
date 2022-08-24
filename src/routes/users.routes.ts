import { Router } from "express";
import { registerUser, loginUserController, sendNoteController, getAllNotesConteroller } from "../controllers/user.controller";
import { loginValidation, userValidation } from "../middlewares/validation/user.validation";
import { upload } from '../config/uploadConfig';
import { notePaginationValidation, noteValidation } from "../middlewares/validation/note.validation";
import { protect } from "../middlewares/protect.middleware";


const usersRouter = Router();

// CREATE USER
usersRouter.route("/").post(upload.single("profile_pic"), userValidation, registerUser);

// LOGIN USER
usersRouter.post("/login", loginValidation, loginUserController)

// GET USER'S NOTES
usersRouter.get("/get-notes", protect, notePaginationValidation, getAllNotesConteroller)

// SEND NOTE
usersRouter.post("/send-note", protect, upload.array("media", 10), noteValidation, sendNoteController)

export default usersRouter;

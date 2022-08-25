import { Router } from "express";
import { subscribeController, registerUser, loginUserController, sendNoteController, getAllNotesConteroller, deleteNoteController } from "../controllers/user.controller";
import { loginValidation, userValidation } from "../middlewares/validation/user.validation";
import { upload } from '../config/uploadConfig';
import { notePaginationValidation, noteValidation } from "../middlewares/validation/note.validation";
import { protect } from "../middlewares/protect.middleware";
import { idValidation } from "../middlewares/validation/validator";


const usersRouter = Router();

// CREATE USER
usersRouter.route("/").post(upload.single("profile_pic"), userValidation, registerUser);
// usersRouter.route("/a").post(upload.single("profile"), (req, res, next) => { res.json({ messege: req.file }) });

// LOGIN USER
usersRouter.post("/login", loginValidation, loginUserController)

// GET USER'S NOTES
usersRouter.get("/get-notes", protect, notePaginationValidation, getAllNotesConteroller)

// SEND NOTE
usersRouter.post("/send-note", protect, upload.array("media", 10), noteValidation, sendNoteController)

usersRouter.delete("/delete-note/:id", protect, idValidation, deleteNoteController)

usersRouter.post("/subscribe", subscribeController)

export default usersRouter;

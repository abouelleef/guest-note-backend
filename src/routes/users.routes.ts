import { Router } from "express";
import { subscribeController, sendNoteController, getAllNotesConteroller, deleteNoteController } from "../controllers/user.controller";
import { loginValidation, userValidation } from "../middlewares/validation/user.validation";
import { upload } from '../config/uploadConfig';
import { notePaginationValidation, noteValidation } from "../middlewares/validation/note.validation";
import { protect } from "../middlewares/protect.middleware";
import { idValidation } from "../middlewares/validation/validator";


const usersRouter = Router();

// GET USER'S NOTES
usersRouter.get("/get-notes", protect, notePaginationValidation, getAllNotesConteroller)

// SEND NOTE
usersRouter.post("/send-note", protect, upload.array("media", 10), noteValidation, sendNoteController)

usersRouter.delete("/delete-note/:id", protect, idValidation, deleteNoteController)

usersRouter.post("/subscribe", protect, subscribeController)

export default usersRouter;

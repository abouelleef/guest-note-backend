import { Router } from 'express';
import notesRouter from './notes.routes';
import usersRouter from './users.routes';

const indexRouter = Router();

indexRouter.use('/notes', notesRouter);
indexRouter.use('/users', usersRouter);


export default indexRouter;

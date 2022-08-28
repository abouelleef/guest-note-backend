import { Router } from 'express';
import authRouter from './auth.routes';
import usersRouter from './users.routes';

const indexRouter = Router();

indexRouter.use('/auth', authRouter);
indexRouter.use('/users', usersRouter);


export default indexRouter;

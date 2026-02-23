import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { auth_controller } from '../controller/auth.controller.js';

export const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('hi');
});

router.post('/signup', auth_controller.signup);
router.post('/login', auth_controller.login);
router.get('/logout', auth_controller.logout);

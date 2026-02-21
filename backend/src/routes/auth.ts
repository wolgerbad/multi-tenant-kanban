import express from 'express';
import { auth_controller } from '../controller/auth.controller.js';

export const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('hi');
});

router.post('/signup', auth_controller.signup);
router.post('/login', auth_controller.login);
router.get('/logout', auth_controller.logout);

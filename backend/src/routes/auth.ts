import express from 'express';
import { auth_controller } from '../controller/auth.controller.js';

export const router = express.Router();

router.post('/signup', auth_controller.signup);
router.post('/login', auth_controller.login);

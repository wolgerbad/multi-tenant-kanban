import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { user_controller } from '../controller/user.controller.js';

export const router = Router();

router.get('/:userId', user_controller.get_user);
router.post('/update/image', user_controller.update_user_image);
router.post('/update/name', user_controller.update_user_name);

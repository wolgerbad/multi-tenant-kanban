import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { user_controller } from "../controller/user.controller.js";

export const router = Router();

router.get('/:userId', user_controller.get_user)
import express from "express";
import type {Request, Response} from "express";
import { login, logout, signup } from "../controller/auth.controller.js";

export const router = express.Router();

router.get('/', (req, res, next )=> {
    res.send('hi')
})
router.post('/signup', signup)
router.post('/login', login)
router.get('/logout', logout)
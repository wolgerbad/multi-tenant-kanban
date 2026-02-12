import { Router } from "express";
import { card_controller } from "../controller/card.controller.js";

export const router = Router()

router.post('/create', card_controller.create_card )
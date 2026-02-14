import { Router } from "express";
import { card_controller } from "../controller/card.controller.js";

export const router = Router()

router.post('/create', card_controller.create_card )
router.post('/switch-positions', card_controller.switch_card_positions)
router.post('/switch-column', card_controller.switch_card_column)
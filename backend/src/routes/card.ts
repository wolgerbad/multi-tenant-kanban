import { Router } from "express";
import { card_controller } from "../controller/card.controller.js";

export const router = Router()

router.get('/comments/:cardId', card_controller.get_card_comments)
router.post('/create', card_controller.create_card )
router.post('/switch-positions', card_controller.switch_card_positions)
router.post('/switch-column', card_controller.switch_card_column)
router.post('/comment/create', card_controller.create_card_comment)
router.post('/update', card_controller.update_card)
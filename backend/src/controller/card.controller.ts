import type { Request, Response, NextFunction } from "express";
import { card_service } from "../service/card.service.js";

async function create_card(req: Request, res: Response, next: NextFunction) {
   const cardDTO = req.body
   try {
       await card_service.create_card(cardDTO)
       res.json({ok: true})
   } catch (error: any) {
    res.status(500).json({ error: error.message })
   }
}

export const card_controller = { create_card }
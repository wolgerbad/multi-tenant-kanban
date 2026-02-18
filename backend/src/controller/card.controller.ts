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

async function switch_card_positions(req: Request, res: Response, next: NextFunction) {
    const card_ids = req.body 
    try {
        await card_service.switch_card_positions(card_ids)
        res.json({ok: true})
    } catch (error: any) {
        res.status(500).json({ok: false, error: error.message})
    }
}

async function switch_card_column(req: Request, res: Response, next: NextFunction) {
    const DTO = req.body
    try {
        await card_service.switch_card_column(DTO)
        res.json({ ok: true })
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

async function get_card_comments(req: Request, res: Response, next: NextFunction) {
    const card_id = Number(req.params.cardId)
    try {
       const result = await card_service.get_card_comments(card_id)
       if(!result.ok) throw new Error(result.message)
       res.json(result.data)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

async function create_card_comment(req: Request, res: Response, next: NextFunction) {
    const DTO = req.body
    try {
        await card_service.create_card_comment(DTO)
        res.json( {ok: true} )
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

async function update_card(req: Request, res: Response, next: NextFunction) {
    const { card_id, ...values } = req.body
    try {
        await card_service.update_card(card_id, values)    
        res.json({ ok: true })
    } catch (error: any) {
        res.status(500).json({ error: error.message })        
    }
}

export const card_controller = { create_card, switch_card_positions, switch_card_column, get_card_comments, create_card_comment, update_card }
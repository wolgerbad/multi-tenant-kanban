import type { Request, Response, NextFunction } from "express";
import { board_service } from "../service/board.service.js";

async function get_boards_of_organization(req: Request, res: Response, next: NextFunction) {
    const orgId = Number(req.params.orgId)
    try {
       const result = await board_service.get_boards_of_organization(orgId)
       if(!result.ok) throw new Error(result.message)
       res.json(result.data)
    } catch (error: any) {
        res.status(500).json({error: error.message})
    }
}

async function get_board_by_id(req: Request, res: Response, next: NextFunction) {
    const boardId = Number(req.params.boardId)
    try {
       const result = await board_service.get_board_by_id(boardId)
        if(!result.ok) throw new Error(result.message)
        res.json(result.data)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

async function create_board(req: Request, res: Response, next: NextFunction) {
    const DTO = req.body
    try {
        await board_service.create_board(DTO)
        res.json({ok: true})
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

export const board_controller = { get_boards_of_organization, get_board_by_id, create_board }
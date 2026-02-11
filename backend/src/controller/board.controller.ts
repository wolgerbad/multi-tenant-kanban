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

export const board_controller = { get_boards_of_organization }
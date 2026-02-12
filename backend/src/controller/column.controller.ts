import type { Request, Response, NextFunction } from "express";
import { column_service } from "../service/column.service.js";

async function get_columns_by_board_id(req: Request, res:Response, next:NextFunction) {
    const boardId = Number(req.params.boardId)
    try {
        const result = await column_service.get_columns_by_board_id(boardId)
        if(!result.ok) throw new Error(result.message)
        res.json(result.data)
    } catch (error: any) {
        res.status(500).json({error: error.message})
    }
}

async function create_column(req: Request, res: Response, next: NextFunction) {
  const columnDTO = req.body;
  try {
      await column_service.create_column(columnDTO)
      res.json({ok: true})
  } catch (error: any) {
    res.status(500).json({error: error.message})
  }
  
}

export const column_controller = { get_columns_by_board_id, create_column }
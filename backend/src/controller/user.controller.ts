import type {Request, Response, NextFunction} from "express";
import { user_service } from "../service/user.service.js";

async function get_user(req: Request, res: Response, next: NextFunction) {
    const userId = Number(req.params.userId);
    console.log("userid:", userId)
    
    const result = await user_service.get_user(userId)
    if(!result?.ok) res.status(500).json({error: result.message})
    res.json(result.data); 
}

export const user_controller = { get_user }
 
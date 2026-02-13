import type { Request, Response, NextFunction } from "express";
import { organization_invite_service } from "../service/organization_invite.service.js";

async function send_organization_invite(req: Request, res: Response, next: NextFunction) {
    const inviteDTO = req.body
    try {
       const result = await organization_invite_service.send_organization_invite(inviteDTO)
       if(!result.ok) throw new Error(result.error)
        res.json({ok: true})
    } catch (error: any) {
        res.status(500).json({ error: error.message })        
    }
}

async function get_organization_invites_of_member(req: Request, res: Response, next: NextFunction) {
    const userId = Number(req.params.userId)
    try {
       const result = await organization_invite_service.get_organization_invites_of_member(userId)
       if(!result.ok) throw new Error(result.message)
        res.json(result.data)        
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

async function answer_organization_invite(req: Request, res: Response, next: NextFunction) {
    const answer = req.body.answer
    const invite_id = req.body.invite_id
    try {
       const result = await organization_invite_service.answer_organization_invite(answer, invite_id)
       if(!result.ok) throw new Error(result.message)
       res.json({ ok: true })
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

export const organization_invite_controller = { send_organization_invite, get_organization_invites_of_member, answer_organization_invite }
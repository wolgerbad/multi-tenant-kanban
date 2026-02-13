import { Router } from "express";
import { organization_invite_controller } from "../controller/organization_invite.controller.js";

export const router = Router()

router.post('/invite', organization_invite_controller.send_organization_invite )
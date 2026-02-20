import { Router } from "express";
import { organization_controller } from "../controller/organization.controller.js";
export const router = Router();
router.get('/:userId', organization_controller.get_organizations_of_member);
router.post('/create', organization_controller.create_organization);

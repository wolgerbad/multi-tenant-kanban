import { Router } from 'express';
import { organization_invite_controller } from '../controller/organization_invite.controller.js';

export const router = Router();

router.get(
  '/user/:userId',
  organization_invite_controller.get_organization_invites_of_member
);
router.post(
  '/answer',
  organization_invite_controller.answer_organization_invite
);
router.post('/invite', organization_invite_controller.send_organization_invite);

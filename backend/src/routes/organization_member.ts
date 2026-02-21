import { Router } from 'express';
import { organization_member_controller } from '../controller/organization_member.controller.js';

export const router = Router();

router.get(
  '/organization/:orgId',
  organization_member_controller.get_members_of_organization
);

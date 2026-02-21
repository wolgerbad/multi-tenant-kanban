import type { Request, Response, NextFunction } from 'express';
import { organization_member_service } from '../service/organization_member.service.js';

async function get_members_of_organization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const orgId = Number(req.params.orgId);

  try {
    const result =
      await organization_member_service.get_members_of_organization(orgId);
    if (!result.ok) throw new Error(result.message);
    res.json(result.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const organization_member_controller = { get_members_of_organization };

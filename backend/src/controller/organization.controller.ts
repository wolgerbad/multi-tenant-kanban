import type { Request, Response, NextFunction } from 'express';
import { organization_service } from '../service/organization.service.js';

async function get_organizations_of_member(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = Number(req.params.userId);
  try {
    const result =
      await organization_service.get_organizations_of_member(userId);
    if (!result.ok) throw new Error(result.message);
    res.json(result.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function create_organization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const DTO = req.body;
  try {
    const result = await organization_service.create_organization(DTO);
    if (!result.ok) throw new Error(result.message);
    res.json({ ok: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const organization_controller = {
  get_organizations_of_member,
  create_organization,
};

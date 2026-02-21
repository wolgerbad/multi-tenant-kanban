import type { Request, Response, NextFunction } from 'express';
import { user_service } from '../service/user.service.js';

async function get_user(req: Request, res: Response, next: NextFunction) {
  const userId = Number(req.params.userId);
  console.log('userid:', userId);

  const result = await user_service.get_user(userId);
  if (!result?.ok) res.status(500).json({ error: result.message });
  res.json(result.data);
}

async function update_user_image(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const DTO = req.body;
  try {
    await user_service.update_user_image(DTO);
    res.json({ ok: true });
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

async function update_user_name(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const DTO = req.body;
  try {
    await user_service.update_user_name(DTO);
    res.json({ ok: true });
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

export const user_controller = {
  get_user,
  update_user_image,
  update_user_name,
};

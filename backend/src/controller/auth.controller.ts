

import type { NextFunction, Request, Response } from 'express';
import { auth_service } from '../service/auth.service.js';

async function signup(req: Request, res: Response, next: NextFunction) {
  const userDTO = { ...req.body };
try {
  const result = await auth_service.signup(userDTO);
  if (result?.error) throw new Error(result.error);

  res.json({ ok: true, data: result.data });
} catch (error: any) {
  res.status(500).json({ error: error.message });
}
}

async function login(req: Request, res: Response, next: NextFunction) {
  const userDTO = { ...req.body };
  try {
    const result = await auth_service.login(userDTO);
    if (result?.error) throw new Error(result.error)
    res.json({ ok: true, data: result.data });
    } catch (error: any) {
      res.status(500).json({ error: error.message }); 
    }
  }

export const auth_controller = { signup, login };

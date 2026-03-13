

import type { NextFunction, Request, Response } from 'express';
import { auth_service } from '../service/auth.service.js';

async function signup(req: Request, res: Response, next: NextFunction) {
  const userDTO = { ...req.body };

  const result = await auth_service.signup(userDTO);
  if (result?.error) res.status(500).json({ error: result.error });
  else {
    res.json({ ok: true, data: result.data });
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  const userDTO = { ...req.body };
  const result = await auth_service.login(userDTO);
  if (result?.error) res.status(500).json({ error: result.error }); 
  else {
    res.json({ ok: true, data: result.data });
  }
}

export const auth_controller = { signup, login };

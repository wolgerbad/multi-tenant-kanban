import type { Request, Response, NextFunction } from 'express';
import { upload_service } from '../service/upload_service.js';

async function create_presigned_url(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const DTO = req.body;
  try {
    const result = await upload_service.create_presigned_url(DTO);
    res.json({ ok: true, data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const upload_controller = { create_presigned_url };

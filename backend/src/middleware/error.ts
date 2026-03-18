import type { Request, Response, NextFunction } from 'express';

export async function error_handler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.status) {
    return res
      .status(err.status)
      .json({ error: err.message, code: err.code });
  }
  res.status(500).json({ error: err.message, code: err.code });
}

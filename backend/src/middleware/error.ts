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
      .json({ message: err.message, code: err.code });
  }
  res.status(500).json({ message: err.message, code: err.code });
}

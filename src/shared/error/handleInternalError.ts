import { Response } from 'express';

export const handleInternalError = (error, res: Response) => {
  return res.status(500).json({
    error: error.message,
    message: 'Internal Server Error',
  });
};

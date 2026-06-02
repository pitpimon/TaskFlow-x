import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  console.error('Error occurred:', error);

  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      details: error.flatten().fieldErrors,
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint failed
    if (error.code === 'P2002') {
      const fields = (error.meta?.target as string[]) || [];
      res.status(409).json({
        error: 'Resource already exists',
        message: `A record with this ${fields.join(', ')} already exists.`,
      });
      return;
    }
    // P2025: Record not found
    if (error.code === 'P2025') {
      res.status(404).json({
        error: 'Not found',
        message: error.message || 'Record not found',
      });
      return;
    }
  }

  // Fallback default error
  const status = (error as any).status || 500;
  const message = error.message || 'Internal Server Error';

  res.status(status).json({
    error: status === 500 ? 'Internal Server Error' : error.name,
    message,
  });
}

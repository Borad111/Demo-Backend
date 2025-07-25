// src/middleware/errorHandler.ts
import { NextFunction, Request, Response } from "express";
import { AppError } from "../erros/appError"; // agar tumne AppError banaya hai to

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err); // console pe error print karo

  // agar AppError instance hai to uska statusCode aur message use karo
  if (err instanceof AppError) {
     res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
    return
  }

  // agar nahi to 500 error bhejo
  res.status(500).json({
    success: false,
    error: "Internal Server Error"
  });
};

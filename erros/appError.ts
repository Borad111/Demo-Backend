export class AppError extends Error{
    statusCode:number;
    isOperational:boolean;


    constructor(message:string,statusCode:number){
        super(message);
        this.statusCode=statusCode;
        this.isOperational=true;
        Error.captureStackTrace(this,this.constructor);
    }
}


export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

// src/errors/duplicateError.ts (new file)
export class DuplicateError extends AppError {
  constructor(message: string) {
    super(message, 409);
    this.name = 'DuplicateError';
  }
}

// src/errors/internalError.ts (new file)
export class InternalError extends AppError {
  constructor(message: string) {
    super(message, 500);
    this.name = 'InternalError';
  }
}
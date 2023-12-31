import { NextFunction, Request, Response } from "express";
import { HttpExceptionParams, HttpStatusCodes } from "./types.js";

export namespace Exception {
    export class HttpException extends Error {
        constructor({ name, message, stack }: HttpExceptionParams) {
            super(message);
            if (!name) {
                name = "SEE_OTHER"
            }
            this.ThrowNewException({ name, message, stack })
        }

        /**
         * Throws a new exception with the provided parameters.
         *
         * @param {HttpExceptionParams} name : The name, message, and stack of the exception.
         * @return {void}
         */
        private ThrowNewException({ name, message, stack }: HttpExceptionParams): never {
            let error = new Error(message);
            error.name = name;
            error.stack = stack
            throw error
        }
        /**
        * Handles exceptions that occur during the execution of the program.
        *
        * @param {Error} err : The exception that occurred.
        * @param {Request} req : The incoming HTTP request.
        * @param {Response} res : The HTTP response to be sent back.
        * @param {NextFunction} next : The next middleware function in the chain.
        */
        static ExceptionHandler(err: Error, req: Request, res: Response, next: NextFunction) {
            if (err instanceof Error) {
                err.name = err.name                 
            }
             console.log(err.stack)
            const errStatus = this.prototype.TypeOfError(err.name as keyof HttpStatusCodes) | 500;
            const errMsg = err.message || 'Something went wrong';
            res
                .status(500)
                .json({
                    success: false,
                    status: errStatus,
                    type: err.name.replace(/_/g, " "),
                    message: err.message,
                    stack: err.stack
                })
            next(errMsg)
        }
        private ExceptionsArray() {
            return {
                "FOUND": 302,
                "SEE_OTHER": 303,
                "NOT_MODIFIED": 304,
                "TEMPORARY_REDIRECT": 307,
                "RESUME_INCOMPLETE": 308,
                "OK": 200,
                "CREATED": 201,
                "ACCEPTED": 202,
                "NON_AUTHORITATIVE_INFORMATION": 203,
                "NO_CONTENT": 204,
                "RESET_CONTENT": 205,
                "PARTIAL_CONTENT": 206,
                "BAD_REQUEST": 400,
                "UNAUTHORIZED": 401,
                "FORBIDDEN": 403,
                "NOT_FOUND": 404,
                "METHOD_NOT_ALLOWED": 405,
                "REQUEST_TIMEOUT": 408,
                "CONFLICT": 409,
                "GONE": 410,
                "LENGTH_REQUIRED": 411,
                "PRECONDITION_FAILED": 412,
                "PAYLOAD_TOO_LARGE": 413,
                "REQUESTED_RANGE_NOT_SATISFIABLE": 416,
                "TOO_MANY_REQUESTS": 429,
                "CLIENT_CLOSED_REQUEST": 499,
                "INTEMAL_SERVER_ERROR": 500,
                "BAD_GATEWAY": 502,
                "SERVICE_UNAVAILABLE": 503,
                "GATEWAY_TIMEOUT": 504,
            }
        }

        /**
         * Returns a string representing the type of error based on the given code.
         *
         * @param {string} name - The http error name. 
         * @return {number} - The http error status code.
         */
        private TypeOfError(name: keyof HttpStatusCodes): number {
            const ExceptionObject = this.ExceptionsArray()
            return ExceptionObject[name]
        }
    }
    export class UnAuthorizedException extends Exception.HttpException {
        constructor({ name, message, stack }: Partial<HttpExceptionParams>) {
            super({ name: "UNAUTHORIZED", message: "Not Authorized", stack })
        }
    }
    export class BadGatewayException extends Exception.HttpException {
        constructor({ name, message, stack }: Partial<HttpExceptionParams>) {
            super({ name: "BAD_GATEWAY", message: "Bad Gateway", stack })
        }
    }

}
import { NextFunction, Request, Response } from "express";
import { HttpExceptionParams, HttpStatusCodes } from "./types";

export class HttpException extends Error {
    constructor({ name, message, stack }: HttpExceptionParams) {
        super(message);
        if (!name) {
            name = "SEE_OTHER"
        }
        if (!message) {
            message = "Please Throw An Exception Message"
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

    private static ExceptionsArray() {
        return {
            // Informational
            CONTINUE: 100,
            SWITCHING_PROTOCOLS: 101,
            PROCESSING: 102,

            // Success
            OK: 200,
            CREATED: 201,
            ACCEPTED: 202,
            NON_AUTHORITATIVE_INFORMATION: 203,
            NO_CONTENT: 204,
            RESET_CONTENT: 205,
            PARTIAL_CONTENT: 206,
            MULTI_STATUS: 207,
            ALREADY_REPORTED: 208,
            IM_USED: 226,

            // Redirection
            MULTIPLE_CHOICES: 300,
            MOVED_PERMANENTLY: 301,
            FOUND: 302,
            SEE_OTHER: 303,
            NOT_MODIFIED: 304,
            USE_PROXY: 305,
            SWITCH_PROXY: 306,
            TEMPORARY_REDIRECT: 307,
            PERMANENT_REDIRECT: 308,

            // Client Error
            BAD_REQUEST: 400,
            UNAUTHORIZED: 401,
            PAYMENT_REQUIRED: 402,
            FORBIDDEN: 403,
            NOT_FOUND: 404,
            METHOD_NOT_ALLOWED: 405,
            NOT_ACCEPTABLE: 406,
            PROXY_AUTHENTICATION_REQUIRED: 407,
            REQUEST_TIMEOUT: 408,
            CONFLICT: 409,
            GONE: 410,
            LENGTH_REQUIRED: 411,
            PRECONDITION_FAILED: 412,
            PAYLOAD_TOO_LARGE: 413,
            URI_TOO_LONG: 414,
            UNSUPPORTED_MEDIA_TYPE: 415,
            RANGE_NOT_SATISFIABLE: 416,
            EXPECTATION_FAILED: 417,
            I_AM_A_TEAPOT: 418,
            MISDIRECTED_REQUEST: 421,
            UNPROCESSABLE_ENTITY: 422,
            LOCKED: 423,
            FAILED_DEPENDENCY: 424,
            UPGRADE_REQUIRED: 426,
            PRECONDITION_REQUIRED: 428,
            TOO_MANY_REQUESTS: 429,
            REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
            UNAVAILABLE_FOR_LEGAL_REASONS: 451,

            // Server Error
            INTERNAL_SERVER_ERROR: 500,
            NOT_IMPLEMENTED: 501,
            BAD_GATEWAY: 502,
            SERVICE_UNAVAILABLE: 503,
            GATEWAY_TIMEOUT: 504,
            HTTP_VERSION_NOT_SUPPORTED: 505,
            VARIANT_ALSO_NEGOTIATES: 506,
            INSUFFICIENT_STORAGE: 507,
            LOOP_DETECTED: 508,
            NOT_EXTENDED: 510,
            NETWORK_AUTHENTICATION_REQUIRED: 511,
        }
    }

    /**
     * Returns a string representing the type of error based on the given code.
     *
     * @param {string} name - The http error name. 
     * @return {number} - The http error status code.
     */
    static TypeOfError(name: keyof HttpStatusCodes): number {
        const ExceptionObject = this.ExceptionsArray()
        return ExceptionObject[name]
    }
}
/**
 * Throws an HttpException with a "FORBIDDEN" name, "Access Denied" message, and a stack object containing
 * information about the forbidden resource.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 * @throws {HttpException} Throws an HttpException with a "FORBIDDEN" name, "Access Denied" message, and a stack
 * object containing information about the forbidden resource.
 */
function UnhandledRoutes(req: Request, res: Response, next: NextFunction) {
    throw new HttpException({ name: "FORBIDDEN", message: "Access Denied", stack: { info: "Forbidden Resource", path: req.baseUrl.replace(/\/{2,}/g, '/') } })
}
/**
 * Handles exceptions by setting the HTTP status code, sending a JSON response with error details, and calling the next middleware function.
 *
 * @param {Error} err - The error object to handle.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function to call.
 * @return {void}
 */
/**
 * Handles exceptions by setting the HTTP status code, sending a JSON response with error details, and calling the next middleware function.
 *
 * @param {Error} err - The error object to handle.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function to call.
 * @return {void}
 */
function ExceptionHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof Error) {
        err.name = err.name
    }
    const errStatus = HttpException.TypeOfError(err.name as keyof HttpStatusCodes) || 500;
    const errMsg = err.message || 'Something went wrong';
    res
        .status(errStatus)
        .json({
            success: false,
            status: errStatus,
            type: err.name?.replace(/_/g, " "),
            message: err.message,
            stack: err.stack
        })
    next(errMsg)
}


function CustomExceptionHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err) {
        return ExceptionHandler(err, req, res, next); // handler error and send response
    }
    next();
}
export function createHandlers() {
    return {
        UnhandledRoutes, ExceptionHandler, CustomExceptionHandler
    }
}
export class ServerErrorException extends HttpException {
    constructor({ stack }: Partial<HttpExceptionParams>) {
        super({ name: "INTERNAL_SERVER_ERROR", message: "Application Error", stack })
    }
}
export class NotFoundException extends HttpException {
    constructor({ stack }: Partial<HttpExceptionParams>) {
        super({ name: "NOT_FOUND", message: "The resource you requested was not found", stack })
    }
}
export class UnAuthorizedException extends HttpException {
    constructor({ stack }: Partial<HttpExceptionParams>) {
        super({ name: "UNAUTHORIZED", message: "Not Authorized", stack })
    }
}
export class BadGatewayException extends HttpException {
    constructor({ stack }: Partial<HttpExceptionParams>) {
        super({ name: "BAD_GATEWAY", message: "Bad Gateway", stack })
    }
}
export class DuplicateEntryException extends HttpException {
    constructor({ stack }: Partial<HttpExceptionParams>) {
        super({ name: "CONFLICT", message: "409  Confilict Error, Already Exists ", stack })
    }
}
export class ForbiddenException extends HttpException {
    constructor({ stack }: Partial<HttpExceptionParams>) {
        super({ name: "FORBIDDEN", message: "Access Denied, You are not allowed to perform this action", stack })
    }
}
export class PayloadTooLargeException extends HttpException {
    constructor({ stack }: Partial<HttpExceptionParams>) {
        super({ name: "PAYLOAD_TOO_LARGE", message: "Content is too large, please try again ", stack })
    }
}
export class TooManyRequestException extends HttpException {
    constructor({ stack }: Partial<HttpExceptionParams>) {
        super({ name: "TOO_MANY_REQUESTS", message: "Why are u speeding Up? ,Server is busy to handle Too Many Requests, please try again", stack })
    }
}
export class MethodNotAllowedException extends HttpException {
    constructor({ stack }: Partial<HttpExceptionParams>) {
        super({ name: "METHOD_NOT_ALLOWED", message: "The Method you trying is Not Allowed", stack })
    }
}
export class UnacceptableException extends HttpException {
    constructor({ stack }: Partial<HttpExceptionParams>) {
        super({ name: "UNPROCESSABLE_ENTITY", message: "The Resource you trying to access is Unprocessable/Unacceptable", stack })
    }
}
export class NotImplementedException extends HttpException {
    constructor({ stack }: Partial<HttpExceptionParams>) {
        super({ name: "NOT_IMPLEMENTED", message: "Method Not Implemented", stack })
    }
}
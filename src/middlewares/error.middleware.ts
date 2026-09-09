import { ErrorCode } from '@/enums/error-ode.enum'
import { StatusCode } from '@/enums/status-code.enum'
import BaseError from '@/errors/base.error'
import ErrorResponse from '@/utils/errorResponse'
import { NextFunction, Request, Response } from 'express'

export const errorMiddleware = (
	error: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
): void => {
	if (error instanceof ErrorResponse) {
		res.status(error.statusCode).json({
			message: error.message,
			data: null,
		})
		return
	}

	if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
		res.status(StatusCode.Unauthorized).json({
			message: 'invalid or expired token',
			data: null,
		})
		return
	}

	if (error instanceof BaseError) {
		res.status(error.statusCode).json({
			message: error.code,
			data: error.data || null,
		})
		return
	}

	console.error('Unhandled error:', error)

	res.status(StatusCode.ServerError).json({
		message: ErrorCode.InternalServerError,
		data: null,
	})
}

export default errorMiddleware

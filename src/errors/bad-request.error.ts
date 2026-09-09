import { ErrorCode } from "@/enums/error-ode.enum";
import { StatusCode } from "@/enums/status-code.enum";
import BaseError from "@/errors/base.error";

class BadRequestError extends BaseError{
	public code: ErrorCode;
	public data?: any;
	constructor(code: ErrorCode, data?: any){
		super(code, StatusCode.BadRequest, data);

		this.code = code;
		this.data = data;
	}
}

export default BadRequestError
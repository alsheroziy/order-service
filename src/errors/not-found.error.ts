import { ErrorCode } from "@/enums/error-ode.enum";
import { StatusCode } from "@/enums/status-code.enum";
import BaseError from "@/errors/base.error";

class NoutFoundError extends BaseError{
	public code: ErrorCode;
	public data?: any;
	constructor(code: ErrorCode, data?: any){
		super(code, StatusCode.NotFound, data);

		this.code = code;
		this.data = data;
	}
}

export default NoutFoundError
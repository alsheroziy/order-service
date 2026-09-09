import { ErrorCode } from "@/enums/error-ode.enum";
import { StatusCode } from "@/enums/status-code.enum";

class BaseError extends Error{
	public code: ErrorCode
	public statusCode: StatusCode
	public data?: any

	constructor(code: ErrorCode, statusCode: StatusCode, data: any){
		super(code)
		this.code = code
		this.statusCode = statusCode
		this.data = data
	}
}

export default BaseError
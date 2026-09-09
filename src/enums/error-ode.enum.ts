export enum ErrorCode {
    ValidationError = 'VALIDATION_ERROR',
    Unauthorized = 'UNAUTHORIZED',
    Forbidden = 'FORBIDDEN',
    ProductNotFound = 'PRODUCT_NOT_FOUND',
    OrderNotFound = 'ORDER_NOT_FOUND',
    InsufficientStock = 'INSUFFICIENT_STOCK',
    IdempotencyKeyMissing = 'IDEMPOTENCY_KEY_MISSING',
    OrderAlreadyCancelled = 'ORDER_ALREADY_CANCELLED',
    OrderCannotBeCancelled = 'ORDER_CANNOT_BE_CANCELLED',
    Conflict = 'CONFLICT',
    UserNotFound = 'USER_NOT_FOUND',
    InternalServerError = 'INTERNAL_SERVER_ERROR',
}

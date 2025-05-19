/**It is important that this is present in every API.
 * @access For server side only.
 */
export const backendURL = { baseURL: process.env.API_URL };
export const ENVIROMENT = process.env.NODE_ENV;
export const IMAGE_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
export const S3_IMAGE =
  process.env.S3_IMAGE_BASE_URL ?? process.env.NEXT_PUBLIC_S3_IMAGE_BASE_URL;
export const POSTER_URL =
  ENVIROMENT === "production" ? S3_IMAGE : IMAGE_URL + "/api/file";

export const AVATAR_URL =
  ENVIROMENT === "production" ? S3_IMAGE : IMAGE_URL + "/api/file";

/**Default Pagination page number */
export const DEFAULT_PAGE = 1;
/**Default Pagination page size */
export const DEFAULT_PAGE_SIZE = 10;

export const HTTP_STATUS = {
  // 4xx Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
};

import { Int32 } from "../../types";

export interface TmdbErrorResponse {
    status_message: string;
    success?: false,
    status_code: Int32;
}
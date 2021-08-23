import { Int32 } from "../../types";

export type TmdbMovieId = Int32;

export interface TmdbGetMovieRequestQuery extends Record<string, string>{
    api_key: string;
    language?: string;
    append_to_response?: string;
    include_adult?: 'false';
    page?: string;
}
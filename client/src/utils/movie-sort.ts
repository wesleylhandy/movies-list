import { TmdbMovie, TmdbMoviesPageResult } from "./movie";

export enum MovieListSort {
    NameAscending = "Name Ascending",
    NameDescending = "Name Descending",
    GenreAscending = "Genre Ascending",
    GenreDescending = "Genre Descending",
    YearAscending = "Year Ascending",
    YearDescending = "Year Descending",
}

export type Option = {
    value: MovieListSort;
    label: MovieListSort;
};
  
export const sortOptions: Option[] = [
    { value: MovieListSort.NameAscending, label: MovieListSort.NameAscending },
    { value: MovieListSort.NameDescending, label: MovieListSort.NameDescending },
    { value: MovieListSort.GenreAscending, label: MovieListSort.GenreAscending },
    {
        value: MovieListSort.GenreDescending,
        label: MovieListSort.GenreDescending,
    },
    { value: MovieListSort.YearAscending, label: MovieListSort.YearAscending },
    { value: MovieListSort.YearDescending, label: MovieListSort.YearDescending },
];
  
export function sortedResults(selectedSort: MovieListSort, results: TmdbMoviesPageResult['results'] = []): TmdbMovie[] {
    switch (selectedSort) {
        case MovieListSort.NameAscending:
            return results.sort((a, b) => {
                if (a.title.toString() > b.title.toString()) {
                    return 1;
                }
                if (a.title.toString() < b.title.toString()) {
                    return -1;
                }
                return 0;
            });

        case MovieListSort.NameDescending:
            return results.sort((a, b) => {
                if (a.title.toString() < b.title.toString()) {
                    return 1;
                }
                if (a.title.toString() > b.title.toString()) {
                    return -1;
                }
                return 0;
            });
        case MovieListSort.GenreAscending:
            return results.sort((a, b) => {
                let aGenre = a.genres?.length
                    ? String(a.genres.sort()[0].name)
                    : "zzzzzz";
                let bGenre = b.genres?.length
                    ? String(b.genres.sort()[0].name)
                    : "zzzzzz";
                if (aGenre > bGenre) {
                    return 1;
                }
                if (aGenre < bGenre) {
                    return -1;
                }
                return 0;
            });
        case MovieListSort.GenreDescending:
            return results.sort((a, b) => {
                let aGenre = a.genres?.length
                    ? String(a.genres.sort()[0].name)
                    : "zzzzzz";
                let bGenre = b.genres?.length
                    ? String(b.genres.sort()[0].name)
                    : "zzzzzz";
                if (aGenre < bGenre) {
                    return 1;
                }
                if (aGenre > bGenre) {
                    return -1;
                }
                return 0;
            });
        case MovieListSort.YearAscending:
            return results.sort((a, b) => {
                let aYear = a.release_date
                    ? Number.parseInt(a.release_date.slice(0, 4))
                    : 9999;
                let bYear = b.release_date
                    ? Number.parseInt(b.release_date.slice(0, 4))
                    : 9999;
                if (aYear > bYear) {
                    return 1;
                }
                if (aYear < bYear) {
                    return -1;
                }
                return 0;
            });
        case MovieListSort.YearDescending:
            return results.sort((a, b) => {
                let aYear = a.release_date
                    ? Number.parseInt(a.release_date.slice(0, 4))
                    : 9999;
                let bYear = b.release_date
                    ? Number.parseInt(b.release_date.slice(0, 4))
                    : 9999;
                if (aYear < bYear) {
                    return 1;
                }
                if (aYear > bYear) {
                    return -1;
                }
                return 0;
            });
        default:
            return [];
    }
}
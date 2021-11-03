import { MovieListSort, Option, sortOptions } from "../utils/movie-sort";
import Select from "react-select";
import { isPresent } from "@perfective/common";

export interface SortMovieProps {
  isDisabled: boolean;
  onSort: (term: MovieListSort) => void;
  selectedSort: MovieListSort;
}

export function SortMovies(props: SortMovieProps): JSX.Element {
  const { isDisabled, onSort, selectedSort } = props;

  function handleChange(selected: Option | null): void {
    if (isPresent(selected)) return onSort(selected.value);
    onSort(MovieListSort.NameAscending);
  }

  return (
      <div className="fixed w-60 top-5">
          <label className="flex items-center"><span className="text-gray-100 mr-5">Sort</span>
            <Select
                className="flex-grow"
                options={sortOptions}
                isDisabled={isDisabled}
                onChange={handleChange}
                defaultValue={{ value: selectedSort, label: selectedSort }}
            />
        </label>
    </div>
  );
}

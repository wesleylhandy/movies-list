import { MovieListSort } from "../utils/movie";
import Select from "react-select";
import { isPresent } from "../utils/value";

export interface SortMovieProps {
  isDisabled: boolean;
  onSort: (term: MovieListSort) => void;
  selectedSort: MovieListSort;
}

type Option = {
  value: MovieListSort;
  label: MovieListSort;
};

const options: Option[] = [
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

export function SortMovies(props: SortMovieProps): JSX.Element {
  const { isDisabled, onSort, selectedSort } = props;

  function handleChange(selected: Option | null): void {
    if (isPresent(selected)) return onSort(selected.value);
    onSort(MovieListSort.NameAscending);
  }

  return (
      <div className="fixed w-60">
          <label className="flex items-center"><span className="text-gray-100 mr-5">Sort</span>
            <Select
                className="flex-grow"
                options={options}
                isDisabled={isDisabled}
                onChange={handleChange}
                defaultValue={{ value: selectedSort, label: selectedSort }}
            />
        </label>
    </div>
  );
}

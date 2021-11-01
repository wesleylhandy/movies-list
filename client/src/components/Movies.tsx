import { useState, useEffect, useCallback } from "react";
import {
  emptyTmdbMoviesPageResult,
  MovieListSort,
  MOVIE_TILE_WIDTH,
  TmdbMovie,
  TmdbMovieGenre,
  TmdbMoviesPageResult,
} from "../utils/movie";
import { MovieSlide } from "./MovieSlide";
import { MovieSlider } from "./MovieSlider";
import { SliderNavigationDirection } from "../utils/slider-navigation-direction";
import { SortMovies } from "./SortMovies";
import { Spinner } from "./Spinner";

export function Movies(): JSX.Element | null {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [pageResult, setPageResult] = useState<TmdbMoviesPageResult>(
    emptyTmdbMoviesPageResult()
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<MovieListSort>(
    MovieListSort.NameAscending
  );

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetch(`/api/movies/now_playing?page=1`).then((res) => res.json()),
      fetch(`/api/movie/genres`).then((res) => res.json()),
    ])
      .then(([pageResult, { genres }]) => {
        const results = pageResult.results.map((movie: TmdbMovie) => {
          let movieGenres = [];
          if (movie.genre_ids) {
            movieGenres = movie.genre_ids
              .map((id) => {
                return genres.find((genre: TmdbMovieGenre) => id === genre.id);
              })
              .filter(Boolean);
          }
          return { ...movie, genres: movieGenres };
        });
        setPageResult({ ...pageResult, results });
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (
      activeIndex === pageResult.results.length - 4 &&
      pageResult.page < pageResult.total_pages
    ) {
      setIsLoading(true);
      fetch(`/api/movies/now_playing?page=${pageResult.page + 1}`)
        .then((res) => res.json())
        .then((newPageResult) => {
          setPageResult((oldPageResult) => ({
            ...oldPageResult,
            page: newPageResult.page,
            results: [...oldPageResult.results, ...newPageResult.results],
            total_pages: newPageResult.total_pages,
            total_results: newPageResult.total_results,
          }));
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [
    activeIndex,
    pageResult.results,
    pageResult.page,
    pageResult.total_pages,
  ]);

  useEffect(() => {
    if (pageResult.results.length > 0) {
      const results = pageResult.results;
      let sorted: TmdbMovie[] = [];
      switch (selectedSort) {
        case MovieListSort.NameAscending:
          sorted = results.sort((a, b) => {
            if (a.title.toString() > b.title.toString()) {
              return 1;
            }
            if (a.title.toString() < b.title.toString()) {
              return -1;
            }
            return 0;
          });
          setPageResult((previousPageResult) => ({
            ...previousPageResult,
            results: sorted,
          }));
          break;
        case MovieListSort.NameDescending:
          sorted = results.sort((a, b) => {
            if (a.title.toString() < b.title.toString()) {
              return 1;
            }
            if (a.title.toString() > b.title.toString()) {
              return -1;
            }
            return 0;
          });
          setPageResult((previousPageResult) => ({
            ...previousPageResult,
            results: sorted,
          }));
          break;
        case MovieListSort.GenreAscending:
          sorted = results.sort((a, b) => {
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
          setPageResult((previousPageResult) => ({
            ...previousPageResult,
            results: sorted,
          }));
          break;
        case MovieListSort.GenreDescending:
          sorted = results.sort((a, b) => {
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
          setPageResult((previousPageResult) => ({
            ...previousPageResult,
            results: sorted,
          }));
          break;
        case MovieListSort.YearAscending:
          sorted = results.sort((a, b) => {
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
          setPageResult((previousPageResult) => ({
            ...previousPageResult,
            results: sorted,
          }));
          break;
        case MovieListSort.YearDescending:
          sorted = results.sort((a, b) => {
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
          setPageResult((previousPageResult) => ({
            ...previousPageResult,
            results: sorted,
          }));
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSort]);

  const totalCount = pageResult.total_results;
  const canSlidePrev =
    typeof activeIndex !== "undefined" ? activeIndex > 0 : false;
  const canSlideNext =
    typeof activeIndex !== "undefined"
      ? activeIndex < totalCount - 1
      : totalCount - 1 > 0;

  const handleSlide = useCallback(
    (direction: SliderNavigationDirection, isAll?: boolean): void => {
      if (isLoading) return;
      if (direction === SliderNavigationDirection.Previous && isAll) {
        setActiveIndex(0);
      } else if (
        direction === SliderNavigationDirection.Previous &&
        canSlidePrev
      ) {
        setActiveIndex((prevIndex) => (prevIndex ? prevIndex - 1 : 0));
      } else if (direction === SliderNavigationDirection.Next && isAll) {
        setActiveIndex(totalCount - 1);
      } else if (direction === SliderNavigationDirection.Next && canSlideNext) {
        setActiveIndex((prevIndex) => (prevIndex ? prevIndex + 1 : 1));
      }
    },
    [canSlideNext, canSlidePrev, isLoading, totalCount]
  );

  const handleFocus = useCallback(() => {
    if (isLoading) return;
    if (typeof activeIndex === "undefined") {
      setActiveIndex(0);
    }
  }, [activeIndex, isLoading]);

  const handleSort = useCallback((selectedSort: MovieListSort) => {
    setSelectedSort(selectedSort);
  }, []);

  const handleMouseEnter = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  if (totalCount === 0) {
    return null;
  }

  return (
    <MovieSlider
      ariaLabel="Movies Currently Playing"
      canSlidePrev={canSlidePrev}
      canSlideNext={canSlideNext}
      carouselId="featured-products-home-page"
      isLoading={isLoading}
      onSlide={handleSlide}
      onFocus={handleFocus}
      slideWidth={MOVIE_TILE_WIDTH}
    >
      <SortMovies
        isDisabled={isLoading}
        selectedSort={selectedSort}
        onSort={handleSort}
      />
      {pageResult.results.map((movie, index) => (
        <MovieSlide
          key={movie.id}
          isActive={activeIndex === index}
          index={index}
          movie={movie}
          onMouseEnter={handleMouseEnter}
        />
      ))}
      <Spinner isActive={isLoading} />
    </MovieSlider>
  );
}

import * as React from "react";
import {
  defaultTmdbMoviesPageResult,
  MOVIE_TILE_WIDTH,
  resultsFromFetch,
  TmdbMovie,
  TmdbMovieGenre,
  TmdbMoviesPageResult,
  uniqueResults,
} from "../utils/movie";
import { MovieSlide } from "./MovieSlide";
import { MovieSlider } from "./MovieSlider";
import { SliderNavigationDirection } from "../utils/slider-navigation-direction";
import { Spinner } from "./Spinner";
import { useAssignReducer } from "../hooks/useAssignReducer";
import {
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from 'react-query';
import { isPresent } from "@perfective/common";
import { useFetch } from "../hooks/useFetch";
import {
  decrementActiveIndex,
  incrementActiveIndex,
  initialSliderState,
  setActiveIndex,
  updatePage
} from "../utils/slider";

export function Movies(): JSX.Element | null {
  const [{ activeIndex, page, pageResult }, sliderDispatch] = useAssignReducer(initialSliderState());
  const { fetchData: fetchMovies } = useFetch<TmdbMoviesPageResult>();
  const { fetchData: fetchGenres } = useFetch<{ genres: TmdbMovieGenre[] }>();
  const { fetchData: fetchMovieDetails } = useFetch<{ movie: TmdbMovie }>();
  const fetchPaginatedNowPlaying = ({ pageParam = 1 }) => fetchMovies({ info: `/api/movies/now_playing?page=${pageParam}`})
  const {
    data: nowPlaying,
    error: fetchNowPlayingError,
    fetchNextPage,
    hasNextPage,
    isFetching: isFetchingNowPlaying,
    isFetchingNextPage: isFetchingMoreNowPlaying,
  } = useInfiniteQuery('movies', fetchPaginatedNowPlaying, {
    getNextPageParam: (lastPage) => lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    getPreviousPageParam: (lastPage) => lastPage.page > 1 ? lastPage.page - 1 : undefined,
    staleTime: 24 * 60 * 60 * 1000,
  });
  const {
    data: genres,
    isFetching: isFetchingGenres,
    error: fetchGenresError,
  } = useQuery('genres', () => fetchGenres({ info: `/api/movie/genres` }), { staleTime: 24 * 60 * 60 * 1000 });
  const queryClient = useQueryClient();

  const isLoading = isFetchingNowPlaying || isFetchingMoreNowPlaying || isFetchingGenres;

  React.useEffect(() => {
    const results = uniqueResults([
      ...pageResult.results,
      ...resultsFromFetch(nowPlaying, genres),
    ]);
    const newPageResult: TmdbMoviesPageResult = defaultTmdbMoviesPageResult({
      ...nowPlaying?.pages.reduce((pageResult, page) => ({...pageResult, ...page})) ?? {},
      results,
    });
    results.map(result => queryClient.prefetchQuery(
      ['movie', result.id],
      () => fetchMovieDetails({ info: `/api/movie/${result.id}` }),
      { staleTime: 24 * 60 * 60 * 1000 },
    ));
    sliderDispatch({ pageResult: newPageResult })
  // eslint-disable-next-line react-hooks/exhaustive-deps -- igore dispatch
  }, [nowPlaying, genres]);

  React.useEffect(() => {
    fetchNextPage();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- only once
  }, [page]);

  React.useEffect(() => {
    if (
      activeIndex === pageResult.results.length - 4 && hasNextPage
    ) {
      sliderDispatch(updatePage(pageResult.page + 1));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- ignore dispatch
  }, [activeIndex, pageResult, hasNextPage]);
    

  const totalCount = pageResult.total_results;
  const canSlidePrev = activeIndex > 0;
  const canSlideNext = activeIndex < totalCount - 1;

  const handleSlide = React.useCallback(
    (direction: SliderNavigationDirection, isAll?: boolean): void => {
      if (isLoading) return;
      if (direction === SliderNavigationDirection.Previous && isAll) {
        sliderDispatch(setActiveIndex(0))
      } else if (
        direction === SliderNavigationDirection.Previous &&
        canSlidePrev
      ) {
        sliderDispatch(decrementActiveIndex(activeIndex));
      } else if (direction === SliderNavigationDirection.Next && isAll) {
        sliderDispatch(setActiveIndex(totalCount - 1));
      } else if (direction === SliderNavigationDirection.Next && canSlideNext) {
        sliderDispatch(incrementActiveIndex(activeIndex));
      }
    },
    [canSlideNext, canSlidePrev, isLoading, sliderDispatch, activeIndex, totalCount]
  );

  const handleMouseEnter = React.useCallback((activeIndex: number) => {
    sliderDispatch({ activeIndex })
  }, [sliderDispatch]);

  if (isPresent(fetchNowPlayingError) || isPresent(fetchGenresError)) {
    console.error(fetchNowPlayingError)
    console.error(fetchGenresError)
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
      slideWidth={MOVIE_TILE_WIDTH}
    >
      {pageResult.results.map((movie, index) => (
        <MovieSlide
          key={movie.id}
          isActive={activeIndex === index}
          isFetching={isLoading}
          index={index}
          movieId={movie.id}
          onMouseEnter={handleMouseEnter}
        />
      ))}
      <Spinner isActive={isLoading} />
    </MovieSlider>
  );
}

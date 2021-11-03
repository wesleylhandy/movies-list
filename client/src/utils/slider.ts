import { emptyTmdbMoviesPageResult, TmdbMoviesPageResult } from "./movie"

export interface SliderState {
    activeIndex: number;
    page: number;
    pageResult: TmdbMoviesPageResult;
  }
  
export function initialSliderState(): SliderState {
    return {
        activeIndex: 0,
        page: 1,
        pageResult: emptyTmdbMoviesPageResult(),
    }
}
  
export function updatePage(page: number): Partial<SliderState> {
    return {
        page,
    }
}
  
export function incrementActiveIndex(state?: number): Partial<SliderState> {
    return {
        activeIndex: state ? state + 1 : 1,
    }
}
  
export function decrementActiveIndex(state?: number): Partial<SliderState> {
    return {
      activeIndex: state ? state - 1 : 0,
    }
}

export function setActiveIndex(activeIndex: number): Partial<SliderState> {
    return {
      activeIndex,
    }
}

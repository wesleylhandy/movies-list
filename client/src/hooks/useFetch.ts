import { useCallback, useRef, useReducer, useEffect } from "react";

/**
 * Default Timeout for wrapping fetch calls
 * @readonly
 * @constant
 */
const DEFAULT_FETCH_TIMEOUT = 6000;

/**
 * Enum for fetch-state values.
 * @readonly
 * @enum {string}
 */
enum FETCH_STATE {
  BEGIN_FETCH = "begin-fetch",
  FETCH_ERROR = "fetch-error",
  FETCH_SUCCESS = "fetch-success",
  END_FETCH = "end-fetch"
};

/**
 * @typedef {Object} FetchState
 * @property {* | null} data=null - The data returned from the fetch
 * @property {Boolean} isFetching - Whether or not fetch has begun but not ended
 * @property {Error | null} error=null - An error value if previous fetch failed
 */
interface FetchState<DataType = any> {
    data: DataType;
    isFetching: boolean;
    error: unknown | null;
}

/**
 * @typedef {Object} FetchAction
 * @property {FETCH_STATE} type - The current state of the fetch
 * @property {Partial<FetchState>} payload - The data to update the current state
 */
interface FetchAction<DataType> {
    type: FETCH_STATE;
    payload: Partial<FetchState<DataType>>;
}

/**
 *
 * @param {FetchState} state
 * @param {FetchAction} action
 * @returns FETCH_STATE
 */
function reducer<DataType>(state: FetchState<DataType>, action: FetchAction<DataType>) {
  switch (action.type) {
    case FETCH_STATE.BEGIN_FETCH:
      return { ...state, isFetching: true };
    case FETCH_STATE.FETCH_ERROR:
      return { ...state, error: action.payload };
    case FETCH_STATE.FETCH_SUCCESS:
      return { ...state, data: action.payload };
    case FETCH_STATE.END_FETCH:
      return { ...state, isFetching: false };
    default:
      return { ...state };
  }
}

/**
 * @returns FetchState
 */
function initialFetchState<DataType>(): FetchState<DataType> {
  return {
    data: null as unknown as DataType,
    isFetching: false,
    error: null
  };
}

/**
 * Checks for ok status from response or throws Error
 *
 * @param {Response} response - fetch response
 * @returns Response - fetch response
 * @throws Error - Will throw if response is not OK.
 */
function status(response: Response): Response {
  if (!response.ok) {
    throw new Error("HTTP error, status = " + response.status);
  }
  return response;
}

/**
 * Checks response headers and returns either response.json() or response.text()
 *
 * @param {Response} response - fetch response
 * @returns Promise<any>
 */
function handleResponse(response: Response): Promise<any> {
  const contentType = response.headers.get("content-type") ?? "html/text";
  if (contentType.includes("json")) {
    return response.json();
  }
  return response.text();
}

/**
 * Dispatches fetch-success action
 *
 * @param {React.Dispatch<FetchAction>} dispatch
 */
function handleData<DataType>(dispatch: React.Dispatch<FetchAction<DataType>>): (data: DataType) => void {
  return (data) => dispatch({ type: FETCH_STATE.FETCH_SUCCESS, payload: data });
}

/**
 * Dispatches fetch-error action
 *
 * @param {React.Dispatch<FetchAction>} dispatch
 */
function handleError<DataType>(dispatch: React.Dispatch<FetchAction<DataType>>): (error: FetchState<DataType>['error']) => void  {
  return (error) => dispatch({ type: FETCH_STATE.FETCH_ERROR, payload: { error } });
}

/**
 * Dispatches end-fetch action
 *
 * @param {React.Dispatch<FetchAction>} dispatch
 */
function handleEndFetch<DataType>(dispatch: React.Dispatch<FetchAction<DataType>>): () => void {
  return () => dispatch({ type: FETCH_STATE.END_FETCH, payload: {} });
}

/**
 * Clears timeout if one has been set
 *
 * @param {number | null} timeout
 */
function clearFetchTimeout(timeout: number | null) {
  if (timeout) {
    clearTimeout(timeout);
  }
}

/**
 * @typedef {Object} UseFetch
 * @property {* | null} data=null - The data returned from the fetch
 * @property {Boolean} isFetching - Whether or not fetch has begun but not ended
 * @property {Error | null} error=null - An error value if previous fetch failed
 * @property {Function} fetchData - Wrapped fetch method
 * @property {AbortController} controller - An Abort Controller for aborting the fetch
 */
interface UseFetch<DataType> extends FetchState<DataType> {
    fetchData(): Promise<void>;
    abortController: AbortController;
}

/**
 * React hook wrapping fetch in a controller and isFetching state
 *
 * @param {Object} fetchParams - The url and configuration normally passed to fetch
 * @param {String} fetchParams.url - The endpoint being called by fetch
 * @param {RequestInit} [fetchParams.init] - Fetch RequestInit Object
 * @returns UseFetch - Data, Error, isFetching, fetchData, controller
 */
export function useFetch<DataType = any>({ info, init = {} }: { info: RequestInfo, init?: RequestInit }): UseFetch<DataType> {
  const controller = useRef(new AbortController());
  const [fetchState, dispatch] = useReducer<React.Reducer<FetchState, FetchAction<DataType>>>(reducer, initialFetchState<DataType>());

  const fetchData = useCallback(() => {
    controller.current = new AbortController();
    dispatch({ type: FETCH_STATE.BEGIN_FETCH, payload: {} });
    return fetch(info, {
      ...init,
      signal: controller.current.signal
    })
      .then(status)
      .then(handleResponse)
      .then(handleData(dispatch))
      .catch(handleError(dispatch))
      .finally(handleEndFetch(dispatch));
  }, [init, info]);

  useEffect(() => {
    let timeout: any = null;
    if (fetchState.isFetching) {
      timeout = setTimeout(() => {
        controller.current.abort();
        dispatch({
          type: FETCH_STATE.FETCH_ERROR,
          payload: {
              error: new Error("Fetch took too long to respond.")
          }
        });
      }, DEFAULT_FETCH_TIMEOUT);
    } else {
      clearFetchTimeout(timeout);
    }
    return function cleanup() {
      clearFetchTimeout(timeout);
    };
  }, [fetchState.isFetching]);

  return {
    ...fetchState,
    abortController: controller.current,
    fetchData
  };
}

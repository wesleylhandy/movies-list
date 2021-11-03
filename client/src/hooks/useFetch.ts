import * as React from "react";
import { DispatchAssign, useAssignReducer } from "./useAssignReducer";

/**
 * Default Timeout for wrapping fetch calls
 * @readonly
 * @constant
 */
const DEFAULT_FETCH_TIMEOUT = 15000;

/**
 * @typedef {Object} FetchState
 * @property {* | null} data=null - The data returned from the fetch
 * @property {Boolean} isFetching - Whether or not fetch has begun but not ended
 * @property {Error | null} error=null - An error value if previous fetch failed
 */
interface FetchState {
    isFetching: boolean;
    error: unknown | null;
}

/**
 * @returns FetchState
 */
function initialFetchState(): FetchState {
  return {
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
 * Dispatches fetch-error action
 *
 * @param {React.Dispatch<FetchAction>} dispatch
 */
function handleError(dispatch: DispatchAssign<FetchState>): (error: FetchState['error']) => void  {
  return (error) => dispatch({ error });
}

/**
 * Dispatches end-fetch action
 *
 * @param {React.Dispatch<FetchAction>} dispatch
 */
function handleEndFetch(dispatch: DispatchAssign<FetchState>): () => void {
  return () => dispatch({ isFetching: false });
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
 * @property {Boolean} isFetching - Whether or not fetch has begun but not ended
 * @property {Error | null} error=null - An error value if previous fetch failed
 * @property {Promise} fetchData - Wrapped fetch method
 * @property {AbortController} controller - An Abort Controller for aborting the fetch
 */
interface UseFetch<DataType> extends FetchState {
    fetchData(init?: FetchInit): Promise<DataType>;
    abortController: AbortController;
}

interface FetchInit {
  info?: RequestInfo;
  init?: RequestInit;
}

/**
 * React hook wrapping fetch in a controller and isFetching state
 *
 * @param {Object} fetchParams - The url and configuration normally passed to fetch
 * @param {String} fetchParams.url - The endpoint being called by fetch
 * @param {RequestInit} [fetchParams.init] - Fetch RequestInit Object
 * @returns UseFetch - Data, Error, isFetching, fetchData, controller
 */
export function useFetch<DataType>(): UseFetch<DataType> {
  const controller = React.useRef(new AbortController());
  const [fetchState, dispatch] = useAssignReducer(initialFetchState());

  const fetchData = React.useCallback(( 
    {
      info = '',
      init = {},
    }: FetchInit): Promise<DataType> => {
    controller.current = new AbortController();
    dispatch({ isFetching: true });
    return fetch(info, {
      ...init,
      signal: controller.current.signal
    })
      .then(status)
      .then(handleResponse)
      .catch(handleError(dispatch))
      .finally(handleEndFetch(dispatch));
  }, [dispatch]);

  React.useEffect(() => {
    let timeout: any = null;
    if (fetchState.isFetching) {
      timeout = setTimeout(() => {
        controller.current.abort();
        dispatch({
          error: new Error("Fetch took too long to respond.")
        });
      }, DEFAULT_FETCH_TIMEOUT);
    } else {
      clearFetchTimeout(timeout);
    }
    return function cleanup() {
      clearFetchTimeout(timeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- dispatch should not trigger reevaluation
  }, [fetchState.isFetching]);

  return {
    ...fetchState,
    abortController: controller.current,
    fetchData
  };
}

import * as React from 'react';

import { Value, valueOf } from '@perfective/common/function';

export type DispatchAssign<T> = React.Dispatch<Partial<T>>;

export function useAssignReducer<T>(initializer: Value<T>): [T, DispatchAssign<T>] {
    return React.useReducer<React.Reducer<T, Partial<T>>>(assignReducer, valueOf(initializer));
}

export function assignReducer<T>(state: T, action: Partial<T>): T {
    return {
        ...state,
        ...action,
    };
}
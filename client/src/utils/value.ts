export function isPresent<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}

export function isAbsent<T>(value: T | null | undefined): value is null | undefined {
    return value === null || value === undefined;
}

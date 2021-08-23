export function completeUrl<T extends Record<string, string>>(baseUrl: string, path: string, query?: T): string {
    const searchParams = new URLSearchParams(query);
    return new URL(`${path}?${searchParams.toString()}`, baseUrl).toString();
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeUrl = void 0;
function completeUrl(baseUrl, path, query) {
    const searchParams = new URLSearchParams(query);
    return new URL(`${path}?${searchParams.toString()}`, baseUrl).toString();
}
exports.completeUrl = completeUrl;
//# sourceMappingURL=url.js.map
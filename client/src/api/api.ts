import type { apiProps } from "../types";

export const fetch_Url = "http://localhost:5000";
export const api = (endpoint: string, { method = "GET", item, params }: apiProps = { method: "GET" }) => {

    const fullUrl = new URL(`${fetch_Url}/${endpoint}`);

    if (params) {
        Object.keys(params).forEach(key => fullUrl.searchParams.append(key, params[key]));
    }

    const token = localStorage.getItem("token");
    const isFormData = item instanceof FormData;
    return fetch(fullUrl, {
        method,
        headers: {
            ...(isFormData
                ? {}
                : { "Content-Type": "application/json" }),

            Authorization: `Bearer ${token}`,
        },
        body: item
            ? isFormData
                ? item
                : JSON.stringify(item)
            : undefined,
    });
};

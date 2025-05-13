// src/request.js
import config from "./config";

export async function request(endpoint, options = {}) {
    const url = `${config.baseURL}${endpoint}`;
    return fetch(url, options).then((res) => res.json());
}

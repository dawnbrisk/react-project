// src/request.js
import config from "./config";
import { Dialog } from 'antd-mobile';
export async function request(endpoint, options = {}) {
    const url = `${config.baseURL}${endpoint}`;
    const token = localStorage.getItem("token");
    const isMobile = window.innerWidth <= 768;
    const headers = {
        ...(options.headers || {}),
    };

    // 如果不是 FormData，就默认用 application/json
    const isFormData = options.body instanceof FormData;
    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    // 默认使用 POST，除非明确设置为 GET
    const method = options.method?.toUpperCase() === "GET" ? "GET" : "POST";

    const newOptions = {
        method,
        ...options,
        headers,
    };

    return fetch(url, newOptions)
        .then(res => {
            // 先判断 HTTP 状态码
            if (res.status === 403) {
                localStorage.removeItem("token");
                Dialog.alert({
                    content: 'Login expired. Please sign in again.',
                    confirmText: 'Got it',
                });
                if (!isMobile) {
                    window.location.href = '/login';
                }

            }

            // 不管怎样，先返回 res.json() 解析成 JSON
            return res.json();
        })
        .then(response => {
            if(response.code === 500){
                localStorage.removeItem("token");

                if (!isMobile) {
                    window.location.href = '/login';
                }
            }

            return response.data;
        })
        .catch(err => {
            console.error("error：", err);

        });


}

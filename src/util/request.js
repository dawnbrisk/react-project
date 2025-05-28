// src/request.js
import config from "./config";

export async function request(endpoint, options = {}) {
    const url = `${config.baseURL}${endpoint}`;
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

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
                alert("登录已过期，请重新登录哦。");
                window.location.href = "/login";
                throw new Error("403 Forbidden - 需要重新登录");
            }
            // 不管怎样，先返回 res.json() 解析成 JSON
            return res.json();
        })
        .then(response => {
            // data 是后端返回的 JSON 对象
            if (response.code === 403) {
                localStorage.removeItem("token");
                alert("登录已过期，请重新登录吧。");
                window.location.href = "/login";
                throw new Error("403 Forbidden - 需要重新登录");
            }
            // 这里返回 data.data，也就是你的 token 字符串，或者整个 data 对象都可以
            return response.data;
        })
        .catch(err => {
            console.error("请求出错：", err);
            throw err;
        });


}

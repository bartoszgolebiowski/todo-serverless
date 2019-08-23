import globalAxios from "../../globalAxios";

const TOKEN_KEY = 'token';

export const login = (token) => {
    localStorage.setItem(TOKEN_KEY, `Bearer ${token}`);
    globalAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    delete globalAxios.defaults.headers.common['Authorization'];
};

export const isLogin = () => {
    return !!localStorage.getItem(TOKEN_KEY);
};



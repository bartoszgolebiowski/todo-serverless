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
    const token = localStorage.getItem(TOKEN_KEY);

    if(!!token){
        globalAxios.defaults.headers.common['Authorization'] = token;
        return true;
    }
    return false;
};



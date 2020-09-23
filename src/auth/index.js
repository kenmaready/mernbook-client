import axios from "../utils/axios";

export const authenticate = ({ user, token }, cb) => {
    console.log(token);
    if (typeof window !== "undefined") {
        console.log("setting localStorage.gibblet to:", { user, token });
        localStorage.setItem("gibblet", JSON.stringify({ user, token }));
        cb();
    }
};

export const isAuthenticated = () => {
    if (
        typeof window !== "undefined" &&
        localStorage.getItem("gibblet") &&
        localStorage.getItem("gibblet") !== ""
    ) {
        return JSON.parse(localStorage.getItem("gibblet"));
    } else return false;
};

export const login = (user) => {
    return axios.post("login", user);
};

export const signup = (user) => {
    return axios.post("signup", user);
};

export const logout = (next) => {
    if (typeof window !== "undefined") localStorage.removeItem("gibblet");
    next();
    return axios
        .get("logout")
        .then((response) => {
            console.log("signout response:", response);
            return response;
        })
        .catch((err) => console.log(err));
};

export const socialLogin = (user) => {
    return axios.post(`social-login`, user);
};

export const forgotPassword = (email) => {
    return axios.patch("forgotpassword", { email });
};

export const resetPassword = (resetPasswordLink, newPassword) => {
    return axios.patch("resetpassword", { resetPasswordLink, newPassword });
};

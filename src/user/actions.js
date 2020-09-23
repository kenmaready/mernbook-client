import axios from "../utils/axios";

export const getUser = (userId, token) => {
    return axios.get(`user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const getUsers = (token) => {
    return axios.get("users", {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const getRecommendations = (userId, token) => {
    return axios.get(`/user/recommended/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const updateProfile = (userData, token) => {
    return axios.patch(`user/${userData.get("id")}`, userData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
};

export const follow = (followId, userId, token) => {
    return axios.put(
        `/user/follow`,
        { userId, followId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const unfollow = (unfollowId, userId, token) => {
    return axios.put(
        `/user/unfollow`,
        { userId, unfollowId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const deleteUser = (userId, token) => {
    return axios.delete(`user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

import axios from "../utils/axios";

export const getPost = (postId, token) => {
    return axios.get(`post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const getPosts = (page, token) => {
    return axios.get(`posts?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const getPostsByUser = (userId, token) => {
    return axios.get(`posts/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const createPost = (postData, userId, token) => {
    return axios.post(`posts/${userId}`, postData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
};

export const likePost = (postId, userId, token) => {
    return axios.patch(
        `posts/like`,
        { postId, userId },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

export const unlikePost = (postId, userId, token) => {
    return axios.patch(
        `posts/unlike`,
        { postId, userId },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

export const addComment = (comment, postId, userId, token) => {
    return axios.patch(
        `posts/comment`,
        { postId, comment, userId },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

export const removeComment = (comment, postId, userId, token) => {
    console.log("comment:", comment);
    console.log("postId:", postId);
    console.log("userId:", userId);
    console.log("token:", token);
    return axios.patch(
        `posts/uncomment`,
        { postId, comment, userId },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

export const updatePost = (postId, postData, token) => {
    console.log("token being sent to back end:", token);
    return axios.patch(`posts/${postId}`, postData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deletePost = (postId, token) => {
    return axios.delete(`posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

import axios from "axios";
import config from "../config";

const createPost = async (formData) => {
  const res = await axios.post(`${config.baseUrl}/api/v1/post`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return res.data.data;
};

const fetchPost = async (postId) => {
  const res = await axios.get(`${config.baseUrl}/api/v1/post/${postId}`, {
    withCredentials: true,
  });
  console.log(res);
  return res.data.data;
};

const fetchUserPosts = async (userId, page, limit) => {
  const res = await axios.get(`${config.baseUrl}/api/v1/user/${userId}/posts`, {
    withCredentials: true,
    params: { page, limit },
  });
  console.log(res);
  return res.data.data;
};

const fetchFeed = async (page, limit) => {
  const res = await axios.get(`${config.baseUrl}/api/v1/feed`, {
    withCredentials: true,
    params: { page, limit },
  });
  console.log(res);
  return res.data.data;
};

export { createPost, fetchPost, fetchUserPosts, fetchFeed };

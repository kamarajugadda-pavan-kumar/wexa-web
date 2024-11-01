import axios from "axios";
import config from "../config";

const createPost = (formData) => {
  return axios.post(`${config.baseUrl}/api/v1/post`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
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

export { createPost, fetchUserPosts, fetchFeed };

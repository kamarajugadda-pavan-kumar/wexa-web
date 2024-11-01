import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import NewPost from "../components/posts/NewPost";
import Post from "../components/posts/Post";
import { createPost, fetchUserPosts, fetchFeed } from "../services/postService";
import PostSkeleton from "../components/posts/PostSkeleton";

const Feed = () => {
  const { posts, setPosts, user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("feed"); // "feed" for friends' posts, "myPosts" for user's posts
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setPosts([]);
    setPage(1);
  }, [activeTab]);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  useEffect(() => {
    const postsDiv = document.getElementById("posts");
    if (!postsDiv) return;

    const handleScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } = postsDiv;

      if (scrollTop + clientHeight >= scrollHeight - 5 && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    postsDiv.addEventListener("scroll", handleScroll);
    return () => postsDiv.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const fetchedPosts =
        activeTab === "feed"
          ? await fetchFeed(page, limit)
          : await fetchUserPosts(user.id, page, limit);
      setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-4">
      {/* NewPost Component */}
      <NewPost onSubmit={createPost} />

      {/* Tab Navigation */}
      <div className="flex justify-around mt-6 border-b border-gray-300">
        <button
          className={`py-2 px-4 ${
            activeTab === "feed" ? "font-bold text-blue-500" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("feed")}
        >
          Feed
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "myPosts"
              ? "font-bold text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("myPosts")}
        >
          My Posts
        </button>
      </div>

      {/* Feed Content */}
      <div className="mt-6 max-h-screen overflow-y-auto" id="posts">
        {loading && (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        )}
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
        {loading && (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        )}
        {/* <p className="text-center text-gray-500">
          {activeTab === "feed"
            ? "No posts from friends."
            : "You haven't made any posts yet."}
        </p> */}
      </div>
    </div>
  );
};

export default Feed;

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import NewPost from "../components/posts/NewPost";
import Post from "../components/posts/Post";
import {
  createPost,
  fetchUserPosts,
  fetchFeed,
  fetchPost,
} from "../services/postService";
import PostSkeleton from "../components/posts/PostSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import { showFailureToast } from "../utils/toast";

const Feed = () => {
  const { posts, setPosts, user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("feed"); // "feed" for friends' posts, "myPosts" for user's posts
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [change, setChange] = useState(0);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setChange((prev) => prev + 1);
  }, [activeTab]);

  useEffect(() => {
    fetchPosts();
  }, [page, change]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const fetchedPosts =
        activeTab === "feed"
          ? await fetchFeed(page, limit)
          : await fetchUserPosts(user.id, page, limit);
      setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
      if (fetchedPosts.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const onSubmitHandler = async (formData) => {
    try {
      const res = await createPost(formData);
      const post = await fetchPost(res.id);
      setPosts((prevPosts) => [post, ...prevPosts]);
    } catch (error) {
      showFailureToast("Failed to create post");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-4">
      {/* NewPost Component */}
      <NewPost onSubmit={onSubmitHandler} />

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
        <InfiniteScroll
          dataLength={posts.length}
          next={loadMorePosts}
          hasMore={hasMore}
          loader={
            loading && (
              <>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
              </>
            )
          }
          endMessage={
            <p className="text-center text-gray-500">
              {activeTab === "feed"
                ? "No more posts from friends."
                : "You haven't made any more posts yet."}
            </p>
          }
        >
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Feed;

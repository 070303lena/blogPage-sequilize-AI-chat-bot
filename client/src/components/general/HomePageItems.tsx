import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../provider/checkIsLoginProvider";
import { api } from "../../api/api";
import type { Post } from "../../types";
import LoadingSpinner from "../ui/LoadingSpinner";
import Pagination from "../ui/Pagination";
import Notifications from "../ui/Notification";
import SearchPost from "./posts/SearchPost";
import PostComponent from "./posts/PostComponent";

const POSTS_PER_PAGE = 3;

function HomePageItems() {

    const navigate = useNavigate();
    const { isLogined } = useAuthContext();

    const [filtered, setFiltered] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [postsLoading, setPostsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const fetchPosts = async () => {
        setPostsLoading(true);
        setErrorMessage(undefined);

        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: POSTS_PER_PAGE.toString(),
                title: search
            });

            const res = await api(`posts?${params}`);

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data?.message ||
                    data?.result?.message ||
                    "server error"
                );
            }

            const posts = data?.result?.posts ?? [];
            const totalPages = data?.result?.totalPages ?? 1;

            setFiltered(posts);
            setTotalPages(totalPages);

        } catch (err: any) {
            setErrorMessage(err.message);
        } finally {
            setPostsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [search, currentPage]);

    const handleNavigateToPostPage = (post: Post) => {
        navigate("/posts/" + post.id)
    };

    const handleDeletePost = async (id: number) => {
        setFiltered(prev => prev.filter(post => post.id !== id));
        await fetchPosts();
    };

    return (
        <div className="flex flex-col gap-4 w-200">
            <Notifications
                message={errorMessage}
                position="topRight"
                duration={2000}
            />

            <SearchPost search={search} setSearch={setSearch} />
            {isLogined && (
                <div
                    className="bg-white p-3 rounded-lg w-full cursor-pointer hover:bg-gray-200"
                    onClick={() => navigate("/create-post")}
                >
                    <h2 className="text-xl font-bold">Create new post</h2>
                </div>
            )}

            <div className="relative flex flex-col gap-4 h-[60vh] overflow-auto">
                {(postsLoading) ? (
                    <div className="absolute inset-0 flex justify-center items-center">
                        <LoadingSpinner title="Loading posts" color="transparent" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-white text-center">
                        No posts found
                    </div>
                ) : filtered.map((post) => (
                    <PostComponent
                        key={post.id}
                        post={post}
                        moveToPage={() => handleNavigateToPostPage(post)}
                        paragraph="truncate"
                        onDelete={handleDeletePost}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            )}
        </div>
    );
}

export default HomePageItems;

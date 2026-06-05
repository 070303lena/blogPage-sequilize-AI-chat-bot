import { useState } from "react";
import { MdOutlineMessage } from "react-icons/md";
import type { Post } from "../../../types";
import { useAuthContext } from "../../../provider/checkIsLoginProvider";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import UpdateActions from "./UpdateActions";
import { FaCommentDots, FaHeart, FaRegHeart } from "react-icons/fa";
import Comments from "../comments/Comments";

type Props = {
    post: Post;
    moveToPage?: () => void;
    paragraph?: string
    onDelete?: (id: number) => void;
    showComments?: boolean
};

function PostComponent({ post, moveToPage, paragraph, onDelete, showComments }: Props) {

    const [liked, setLiked] = useState(post.liked);
    const { isLogined } = useAuthContext();
    const navigate = useNavigate();

    const handleLikePost = async (id: number) => {
        setLiked(prev => !prev);
        try {
            const res = await api(`likes/${id}`, { method: "POST" });
            const data = await res.json();
            setLiked(data.liked);
        } catch (error) {
            setLiked(post.liked);
            console.error("Error when Liking", error);
        }
    };

    const handleContactAuthor = async () => {
        if (!isLogined) return navigate("/login")
        try {
            const res = await api("private", {
                method: "POST",
                item: { userId: post.author_id }
            })

            const data = await res.json();
            if (data.chatId) {
                navigate(`/chatBlock?chatId=${data.chatId}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col gap-2 bg-gray-800 text-white p-3 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={handleContactAuthor}
                    >
                        <h2 className="text-xl font-bold">
                            {post.User?.firstName}
                        </h2>
                        <MdOutlineMessage />
                    </div>
                </div>

                <span className="text-gray-400">{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <UpdateActions post={post} onDelete={onDelete} />

            <div className="flex justify-between">
                <span className="cursor-pointer" onClick={moveToPage}>
                    {post.title}
                </span>
            </div>
            <p className={`italic ${paragraph}`}>{post.description}</p>
            <div className="flex gap-2">
                <span
                    className="text-xl cursor-pointer"
                    onClick={() => { isLogined ? handleLikePost(post.id) : navigate("/login") }}
                >
                    {liked ? <FaHeart /> : <FaRegHeart />}
                </span>
                <span
                    className="text-xl cursor-pointer"
                    onClick={() => { isLogined ? navigate(`/posts/${post.id}`) : navigate("/login") }}
                >
                    <FaCommentDots />
                </span>
            </div>
            {showComments && <Comments postId={post.id} />}
        </div>
    );
}

export default PostComponent;

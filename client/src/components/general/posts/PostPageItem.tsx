import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../api/api";
import type { Post } from "../../../types";
import PostComponent from "./PostComponent";

function PostPageItem() {

    const [post, setPost] = useState<Post | null>(null);

    const [loading, setLoading] = useState(true)
    const showComments = true;

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (!id) return;

        setLoading(true);

        api(`posts/${id}`)
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message);
                }
                return data;
            })
            .then(data => setPost(data.result))
            .catch((err) => {
                console.error("err", err);
            })
            .finally(() => setLoading(false));
    }, [id]);


    if (loading) {
        return <div className="text-black">Loading post...</div>;
    }

    if (!post) {
        return <div className="text-black">Post not found</div>;
    }

    return (
        <>
            <div className="flex justify-between gap-5 ">
                <span
                    className="self-start text-black text-2xl p-2 rounded-lg cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    ←
                </span>
            </div>
            <PostComponent
                showComments={showComments}
                key={post.id}
                post={post}
            />
        </>
    );
}

export default PostPageItem;

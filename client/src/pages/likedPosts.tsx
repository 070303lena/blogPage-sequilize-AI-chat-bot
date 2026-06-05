import { useEffect, useState } from "react";
import { api } from "../api/api";
import type { Post } from "../types";
import Page from "../components/layout/Page";
import PostComponent from "../components/general/posts/PostComponent";

function LikedPosts() {

    const [likedPost, setLikedPost] = useState([]);

    const getLikedPosts = async () => {
        const res = await api("likes");
        const data = await res.json();
        setLikedPost(data.result ?? []);
    };

    useEffect(() => {
        getLikedPosts();
    }, []);

    return (
        <Page title="Liked posts page">
            <div className="flex flex-col w-200 gap-5">
                {likedPost.map((post: Post) => (
                    <PostComponent
                        key={post.id}
                        post={post}
                    />
                ))}
            </div>
        </Page>
    );
}

export default LikedPosts;

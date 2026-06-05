import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Post } from "../../../types";
import { api } from "../../../api/api";
import Notifications from "../../ui/Notification";
import PostForm from "./PostForm";

function CreatePost() {
    const location = useLocation();
    const navigate = useNavigate();

    const editingPost = location.state?.post;

    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);

    const [newPost, setNewPost] = useState<Post>(
        editingPost || {
            id: "",
            title: "",
            description: ""
        }
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setErrorMessage(undefined);
        setLoading(true);

        try {
            const url = editingPost ? `posts/${editingPost.id}` : "posts";

            await api(url, {
                method: editingPost ? "PUT" : "POST",
                item: newPost,
            });

            navigate("/");
        } catch (err: unknown) {
            console.error(err);
            setErrorMessage(
                err instanceof Error ? err.message : "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {errorMessage && (
                <Notifications
                    message={errorMessage}
                    position="topRight"
                    duration={2000} />
            )}
            <PostForm
                newPost={newPost}
                setNewPost={setNewPost}
                addNewPost={handleSubmit}
                editingPost={editingPost}
                loading={loading}
            />
        </>
    );
}

export default CreatePost;

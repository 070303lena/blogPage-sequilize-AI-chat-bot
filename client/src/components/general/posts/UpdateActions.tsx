import { useState } from "react";
import { useAuthContext } from "../../../provider/checkIsLoginProvider";
import type { Post } from "../../../types";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import UpdatePost from "./UpdatePost";
import DelConfirmModal from "../../ui/DelConfirmModal";
import Notifications from "../../ui/Notification";

function UpdateActions({ post, onDelete }: {
    post: Post;
    onDelete?: (id: number) => void;
}) {
    const { user } = useAuthContext();

    const isAuthor = !!user && Number(user.id) === Number(post.author_id); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const navigate = useNavigate();

    const handleOpenDeleteModal = () => {
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);

            const res = await api(`posts/${post.id}`, { method: "DELETE" });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            setIsModalOpen(false);
            navigate("/");

            onDelete?.(post.id);
            
        } catch (err: any) {
            setErrorMessage(err.message);
        } finally {
            setDeleting(false);
        }
    };

    const handleEdit = () => {
        navigate("/create-post", { state: { post } });
    };

    return (
        <div>
            <Notifications
                message={errorMessage}
                position="topRight"
                duration={2000}
            />
            <UpdatePost
                isAuthor={isAuthor}
                onEdit={handleEdit}
                onDelete={handleOpenDeleteModal}
            />
            {isModalOpen && (
                <DelConfirmModal
                    deletePost={handleDelete}
                    closeDeleteModal={() => setIsModalOpen(false)}
                    deleting={deleting}
                />
            )}
        </div>
    )
}

export default UpdateActions
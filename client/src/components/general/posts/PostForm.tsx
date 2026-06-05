import { useNavigate } from "react-router-dom";
import type { PostFormProps } from "../../../types";

function PostForm({ newPost, setNewPost, addNewPost, editingPost, loading }: PostFormProps) {

    const navigate = useNavigate();
    
    const isDisabled =
        loading ||
        !newPost.title ||
        !newPost.description;

    return (
        <form
            className="bg-white w-150 min-h-[40vh] flex flex-col gap-5 p-5 rounded-lg"
            onSubmit={addNewPost}
        >
            <span
                className="self-start cursor-pointer text-2xl font-bold hover:text-gray-700"
                onClick={() => navigate("/")}
            >
                ←
            </span>

            <label>
                Post title:
                <input
                    required
                    type="text"
                    className="border px-2 w-full"
                    value={newPost.title}
                    onChange={(e) =>
                        setNewPost((prev) => ({ ...prev, title: e.target.value }))
                    }
                />
            </label>

            <label>
                Post description:
                <textarea
                    required
                    className="border px-2 w-full h-20 resize-none"
                    value={newPost.description}
                    onChange={(e) =>
                        setNewPost((prev) => ({ ...prev, description: e.target.value }))
                    }
                />
            </label>

            <button
                type="submit"
                disabled={isDisabled}
                className="bg-gray-800 cursor-pointer text-white p-2 rounded-lg disabled:opacity-50"
            >
                {loading ? "Saving..." : editingPost ? "Update post" : "Create post"}
            </button>
        </form>
    );
}

export default PostForm;

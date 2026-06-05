import { LuSendHorizontal } from "react-icons/lu"

interface Props {
    comment: string,
    setComment: React.Dispatch<React.SetStateAction<string>>;
    addComment: (parentId: number | null) => void;
    inputRef: any;
    parentId: number | null;
};

function AddComment({ comment, setComment, addComment, inputRef, parentId }: Props) {
    return (
        <div className="flex items-center justify-between px-2 py-1 gap-2 border">
            <input
                ref={inputRef}
                type="text"
                className="p-1 outline-none flex flex-1"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && comment.trim()) {
                        e.preventDefault();
                        addComment(parentId);
                    }
                }}
            />

            <button
                className="text-xl cursor-pointer"
                onClick={() => addComment(parentId)}
            >
                <LuSendHorizontal />
            </button>
        </div>)
}

export default AddComment
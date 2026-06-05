import { useEffect, useRef, useState } from "react";
import { api } from "../../../api/api";
import { useAuthContext } from "../../../provider/checkIsLoginProvider";
import AddComment from "../../ui/AddComment";

function Comments({ postId }: { postId: number }) {
    const [comment, setComment] = useState<string>("");
    const [comments, setComments] = useState<any[]>([]);
    const [parentId, setParentId] = useState<number | null>(null);
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [commentCount, setCommentCount] = useState<null | number>(null);
    const { user } = useAuthContext();

    const fetchComments = async () => {
        const res = await api(`posts/${postId}/comments`);
        if (res.ok) {
            const data = await res.json();
            setComments(data.result.comments || []);
            setCommentCount(data.result.count);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const addComment = async () => {
        if (!comment.trim()) return;

        const res = await api(`posts/${postId}/comments`, {
            method: "POST",
            item: {
                text: comment,
                parent_id: parentId
            }
        });

        if (res.ok) {
            await fetchComments();
            setComment("");
            setParentId(null);
            setReplyTo(null);
        }
    };

    const rootComments = comments.filter(comment => !comment.parent_id);

    const replies = comments.filter(comment => comment.parent_id);

    const getReplies = (id: number) => {
        return replies.filter(reply => reply.parent_id === id);
    };

    const deleteComment = async (id: number) => {
        const res = await api(`comments/${id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            await fetchComments();
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 border p-2">
                <h1 className="text-gray-50/45">Comments: {commentCount}</h1>
                {rootComments.map((com) => (
                    <div key={com.id} className="flex flex-col gap-2">

                        <div className="flex bg-gray-700 p-2 justify-between">
                            <div className="flex flex-col gap-1">
                                <div className="flex">
                                    <span className="font-bold text-sm bg-gray-600 text-gray-300 px-1">
                                        {com.User?.firstName}
                                    </span>
                                    <span className="font-bold text-sm bg-gray-600 text-gray-300 px-1">
                                        {new Date(com.createdAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </span>
                                </div>
                                <span>{com.text}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="text-gray-50/40 cursor-pointer"
                                    onClick={() => {
                                        setParentId(com.id);
                                        setReplyTo(com.User?.firstName);
                                        setComment(`@${com.User?.firstName} `);
                                        inputRef.current?.focus();
                                    }}
                                >
                                    reply
                                </button>
                                {user?.id === com.User?.id && (
                                    <button
                                        className="text-red-400 cursor-pointer"
                                        onClick={() => deleteComment(com.id)}
                                    >
                                        delete
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="ml-6 flex flex-col gap-2">
                            {getReplies(com.id).map((reply) => (
                                <div key={reply.id} className="flex bg-gray-600 p-2 justify-between">
                                    <div className="flex flex-col">
                                        <div className="flex">
                                            <span className="text-xs text-gray-300">
                                                {reply.User?.firstName}
                                            </span>
                                            <span className="font-bold text-xs bg-gray-600 text-gray-300 px-1">
                                                {new Date(reply.createdAt).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </span>
                                        </div>
                                        <span>{reply.text}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            className="text-gray-50/40 text-xs cursor-pointer"
                                            onClick={() => {
                                                setParentId(com.id);
                                                setReplyTo(reply.User?.firstName);
                                                setComment(`@${reply.User?.firstName} `);
                                                inputRef.current?.focus();
                                            }}
                                        >
                                            reply
                                        </button>

                                        <button
                                            className="text-red-400 text-xs cursor-pointer"
                                            onClick={() => deleteComment(reply.id)}
                                        >
                                            delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {replyTo && (
                    <div className="text-sm text-gray-400">
                        Replying to @{replyTo}
                    </div>
                )}

                <AddComment
                    comment={comment}
                    setComment={setComment}
                    addComment={addComment}
                    inputRef={inputRef}
                    parentId={parentId}
                />
            </div>
        </div>
    );
}

export default Comments;
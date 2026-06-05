import { useEffect, useState } from "react"
import { CiEdit } from "react-icons/ci";
import type { GetMessagesProps } from "../../../types";
import { api } from "../../../api/api";
import CreateChatGroup from "./CreateChatGroup";

function GetMessages({
    currentChatName,
    currentChat,
    user,
    messages,
    setMessages,
    normalizeMessage,
    chatId,
    users,
    isPartnerTyping,
    messagesEndRef,
    typingPartnerId
}: GetMessagesProps) {

    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const getMessages = async (id: number | string) => {
        try {
            if (!user) return;
            const res = await api(`message/${id}`);
            const data = await res.json();

            if (!res.ok) throw new Error();
            setMessages(data.result.map((msg: any) => normalizeMessage(msg, user.id)));
        } catch {
            setMessages([]);
        }
    };
    const typingUserName =
        users.find(u => Number(u.id) === Number(typingPartnerId))?.firstName;

    const getSenderName = (id: number) =>
        users.find(u => Number(u.id) === Number(id))?.firstName ?? "Unknown";

    useEffect(() => {
        if (!chatId) return;
        getMessages(chatId);
    }, [chatId]);

    return (
        <>
            <div className="flex items-center justify-between h-15 py-1 px-2 bg-gray-700 text-gray-400">
                <h1 className="font-bold text-lg">
                    {currentChatName}
                </h1>
                {currentChat?.type === "group" && (
                    <span
                        className="text-xl cursor-pointer"
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        <CiEdit />
                    </span>
                )}

            </div>

            <div className="flex flex-col flex-1 overflow-y-auto p-2 gap-2 bg-gray-300">
                {messages.map(msg => {
                    const isMe = Number(msg.sender_id) === Number(user?.id);
                    return (
                        <div
                            key={msg.id}
                            className={`flex items-end gap-2 max-w-[70%]
                                    ${isMe ? "self-end flex-row-reverse" : "self-start"}`}
                        >
                            <img
                                src="/default-avatar.png"
                                className="w-8 h-8 rounded-full"
                            />

                            <div className={`flex flex-col p-2 rounded-lg text-white min-w-0 wrap-break-word
                                    ${isMe ? "bg-blue-500" : "bg-gray-600"}`}
                            >
                                <div className="flex gap-2 items-center">
                                    {!isMe && (
                                        <span className="text-xs opacity-70 mb-1">
                                            {getSenderName(msg.sender_id)}
                                        </span>
                                    )}
                                    <span className="text-[0.65rem] opacity-70">
                                        {msg.createdAt
                                            ? new Date(msg.createdAt).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : ""}
                                    </span>
                                </div>

                                {msg.text}
                            </div>
                        </div>
                    )
                })}

                <div className="text-[14px] text-gray-400 italic">
                    {isPartnerTyping && typingUserName
                        ? `${typingUserName} is typing...`
                        : ""}                </div>

                <div ref={messagesEndRef} />

                {isEditModalOpen && <CreateChatGroup
                    setModalIsOpen={setIsEditModalOpen}
                    initialData={currentChat}
                    users={users}
                />}
            </div>
        </>
    )
}

export default GetMessages
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { socket } from "../socket/socket";
import { useAuthContext } from "../provider/checkIsLoginProvider";
import type { Message, User } from "../types";
import Page from "../components/layout/Page";
import Button from "../components/ui/Button";
import GetChats from "../components/general/messages/GetChats";
import CreateChatGroup from "../components/general/messages/CreateChatGroup";
import GetMessages from "../components/general/messages/GetMessages";
import SendMessages from "../components/general/messages/SendMessages";

function ChatPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [chats, setChats] = useState<any[]>([]);

    const { user } = useAuthContext();

    const [isPartnerTyping, setIsPartnerTyping] = useState(false);
    const [typingPartnerId, setTypingPartnerId] = useState<number | null>(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const [createGroupModalIsOpen, setCreateGroupModalIsOpen] = useState<boolean>(false);
    const [searchParams] = useSearchParams();

    const chatId = Number(searchParams.get("chatId"));

    const currentChat = chats.find(c => c.id === Number(chatId));

    const getChatName = () => {
        if (!currentChat) return "Choose Chat";
        const chatType = currentChat.chat?.type || currentChat.type;
        if (chatType === "private") {
            const otherUserName = currentChat.members?.find((msg: any) =>
                Number(msg.user_id) !== Number(user?.id))
            return otherUserName?.user?.firstName || "Private Chat";
        }
        return currentChat.name || "Group Chat";
    };

    const currentChatName = getChatName();

    const normalizeMessage = (msg: any, myId: number) => ({
        id: msg.id,
        text: msg.text,
        from: (msg.sender_id === myId ? "me" : "other") as "me" | "other",
        createdAt: msg.createdAt,
        sender_id: msg.sender_id,
    });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!user || !chatId) return;

        socket.emit("join_all_chats");

        const onMessageReceived = (data: any) => {
            if (Number(data.chatId) === Number(chatId)) {
                setMessages(prev => {
                    if (prev.some(m => m.id === data.id)) return prev;
                    return [...prev, normalizeMessage(data, user.id)];
                });
            }
        };

        const onTyping = (data: any) => {
            if (Number(data.roomId) === Number(`chat_${chatId}`)) return;

            if (data.roomId === `chat_${chatId}`) {
                setIsPartnerTyping(true);
                setTypingPartnerId(data.userId)
            }
        };

        const onStopTyping = (data: any) => {
            if (data.roomId === `chat_${chatId}`) {
                setIsPartnerTyping(false);
                setTypingPartnerId(null)
            }
        };

        const onGroupCreated = (newGroup: any) => {
            socket.emit("join_all_chats");
            setChats(prev => {
                if (prev.some(c => c.id === newGroup.id)) return prev;
                return [...prev, newGroup];
            });
        };

        socket.on("receive_message", onMessageReceived);
        socket.on("typing", onTyping);
        socket.on("stop_typing", onStopTyping);
        socket.on("group_created", onGroupCreated);

        return () => {
            socket.off("receive_message", onMessageReceived);
            socket.off("typing", onTyping);
            socket.off("stop_typing", onStopTyping);
            socket.off("group_created", onGroupCreated);
        };
    }, [user, chatId]);

    return (
        <Page title="Chat">
            <div className="flex border border-white/40 w-[50%] h-[70vh] gap-2">
                <div className="border-r border-gray-700 w-[50%] flex flex-col gap-8 p-1">
                    <Button onClick={() => setCreateGroupModalIsOpen(true)}>Create Group</Button>

                    <div className="flex flex-col max-h-150 overflow-auto gap-3">
                        <GetChats
                            setChats={setChats}
                            setUsers={setUsers}
                            users={users}
                            chats={chats}
                            receiverId={chatId}
                        />

                        {createGroupModalIsOpen && (
                            <CreateChatGroup
                                users={users}
                                setModalIsOpen={setCreateGroupModalIsOpen}

                            />
                        )}
                    </div>
                </div>

                <div className="flex flex-col w-[50%] h-full">
                    <GetMessages
                        messagesEndRef={messagesEndRef}
                        currentChat={currentChat}
                        currentChatName={currentChatName}
                        user={user}
                        messages={messages}
                        setMessages={setMessages}
                        normalizeMessage={normalizeMessage}
                        chatId={chatId}
                        users={users}
                        isPartnerTyping={isPartnerTyping}
                        typingPartnerId={typingPartnerId}
                    />

                    <SendMessages
                        chatId={Number(chatId)}
                        message={message}
                        setMessage={setMessage}
                    />
                </div>
            </div>
        </Page>
    );
}

export default ChatPage;
import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../../../provider/checkIsLoginProvider";
import { IoSendOutline } from "react-icons/io5";
import { api } from "../../../api/api";
import { AiFillAndroid } from "react-icons/ai";
import ClearChatBot from "./ClearChatBot";
import type { botChatMessages } from "../../../types";
import { useNavigate } from "react-router-dom";

function ChatBot() {
    const [isLoading, setIsLoading] = useState(false);
    const [chatBotIsOpen, setChatBotIsOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<botChatMessages[]>([]);

    const { user, isLogined } = useAuthContext();
    const navigate = useNavigate();

    const sendMessage = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const userMessage = message.trim();
            if (!userMessage) return;

            const res = await api("botMessages/create", {
                method: "POST",
                item: { message: userMessage }
            });

            if (!res.ok) {
                throw new Error("Failed to send message");
            }
            const data = await res.json();
            const answer =
                typeof data.answer === "string"
                    ? JSON.parse(data.answer)
                    : data.answer;

            setMessage("");

            setMessages(prev => [
                ...prev,
                {
                    role: "user",
                    content: userMessage
                },
                {
                    role: "assistant",
                    content:
                        answer.type === "text"
                            ? answer.text
                            : "Redirecting to payment..."
                }
            ]);

            if (answer?.type === "redirect") {
                window.location.href = answer.url;
                return;
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
        finally {
            setIsLoading(false);
        }
    };

    const getMessages = async () => {
        try {
            const res = await api("botMessages");

            if (!res.ok) {
                throw new Error("Failed to get messages");
            }

            const data = await res.json();
            setMessages(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getMessages();
    }, []);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="text-white w-full fixed items-end gap-3 bottom-7 right-7 min-h-10 flex justify-end border-red-200 ">
            {chatBotIsOpen && (
                <div className="w-80 h-110 bg-gray-200 rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h1 className="font-bold text-lg text-gray-900">Chat bot</h1>
                        <button
                            disabled={messages.length === 0}
                            onClick={() => setIsConfirmModalOpen(true)}
                            className="text-gray-400 italic cursor-pointer active:scale-90"
                        >
                            clear
                        </button>
                        <ClearChatBot
                            setMessages={setMessages}
                            setIsConfirmModalOpen={setIsConfirmModalOpen}
                            isConfirmModalOpen={isConfirmModalOpen}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto flex flex-col gap-2">
                        <span className="w-[70%] break-after-all p-2 bg-gray-500 rounded-2xl text-sm">Hi, {user?.firstName}. My name is Blog-Chat. How can I help you? </span>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col gap-2 max-w-[70%] py-2 px-3 rounded-2xl text-sm ${msg.role == "user" ? "self-end text-right bg-blue-500" : "bg-gray-500 "}`}>
                                <span className="font-bold text-gray-200">
                                    {msg.role === "user" ? (user ? user.firstName : "Guest") : "Ai assistant"}
                                </span>
                                <span> {msg.content}</span>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="flex w-full mt-auto border text-gray-900 border-gray-900/20">
                        <input
                            placeholder="Your question"
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                            className="flex-1 p-1 text-gray-900 outline-none"
                        />
                        <button
                            className="p-2 cursor-pointer"
                            onClick={sendMessage}
                            disabled={isLoading}
                        >
                            <IoSendOutline />
                        </button>
                    </div>
                </div>
            )}
            <div
                onClick={() => isLogined ? (setChatBotIsOpen(!chatBotIsOpen)) : navigate("/login")}
                className="rounded-full border p-2 w-12 h-12 hover:bg-white hover:text-gray-800 cursor-pointer active:scale-95"
            >
                <AiFillAndroid className="w-full h-full" />
            </div>
        </div>
    )
}

export default ChatBot;

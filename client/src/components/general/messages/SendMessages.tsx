import { useRef } from "react";
import { IoIosSend } from "react-icons/io";
import { socket } from "../../../socket/socket";
import type { SendMessagesProps } from "../../../types";

function SendMessages({ chatId, message, setMessage }: SendMessagesProps) {
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleTyping = (value: string) => {
        setMessage(value);

        if (!chatId) return;

        socket.emit("typing", `chat_${chatId}`);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stop_typing", `chat_${chatId}`);
        }, 800);
    };

    const sendMessage = () => {
        if (!message.trim() || !chatId) return;

        socket.emit("send_message", {
            text: message,
            chatId,
        });

        socket.emit("stop_typing", `chat_${chatId}`);

        setMessage("");
    };

    return (
        <div className="flex border border-white py-1 px-2">
            <input
                type="text"
                className="flex flex-1 text-white outline-none"
                placeholder="Message..."
                value={message}
                onChange={(e) => handleTyping(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                }}
            />
            <span
                onClick={sendMessage}
                className="text-white text-2xl cursor-pointer"
            >
                <IoIosSend />
            </span>
        </div>)
}

export default SendMessages;

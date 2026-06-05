import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MdOutlineGroups2 } from "react-icons/md";
import { useAuthContext } from "../../../provider/checkIsLoginProvider";
import { api } from "../../../api/api";
import type { Chat, GetChatsProps } from "../../../types";
import { socket } from "../../../socket/socket";

function GetChats({ setChats, setUsers, chats }: GetChatsProps) {
    const navigate = useNavigate();
    const { user, loading } = useAuthContext();
    const [searchParams] = useSearchParams();
    const activeChatId = Number(searchParams.get("chatId"))

    const getAllChats = async () => {
        try {
            const res = await api("chats");
            const data = await res.json();

            if (!res.ok) throw new Error();
            setChats(data.result || []);
        } catch (e) {
            console.error(e);
        }
    };

    const getAllUsers = async () => {
        try {
            const res = await api("users");
            const data = await res.json();
            if (!res.ok) throw new Error();

            setUsers(data.result || []);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        getAllChats();
        getAllUsers();
    }, []);

    useEffect(() => {
        socket.on("chat_updated", (updatedChat: any) => {
            setChats((prevChats: Chat[]) =>
                prevChats.map(chat =>
                    chat.id === updatedChat.id
                        ? {
                            ...chat, name: updatedChat.name,
                            members: updatedChat.members
                        }
                        : chat
                )
            )
        })
        return () => {
            socket.off("chat_updated");
        };
    }, [setChats]);

    return (
        <>
            {chats.filter(chat => chat.type === "private").map(chat => {
                if (loading) return <>Loading...</>;
                const companion = chat.members?.find((m: any) => m?.user?.id !== user?.id)?.user;

                if (!companion) return null;
                return (
                    <div
                        key={`chat_private_${chat.id}`}
                        className={`${activeChatId === chat.id
                            ? "bg-gray-700"
                            : "bg-gray-800"
                            } text-gray-300 py-4 px-2 hover:bg-gray-700 cursor-pointer`}
                        onClick={() => navigate(`/chatBlock?chatId=${chat.id}`)}
                    >
                        {companion.firstName}
                    </div>
                )
            })}

            {chats.filter(chat => chat.type === "group").map(chat => (
                <div
                    key={`chat_${chat.id}`}
                    className={`${activeChatId === chat.id
                        ? "bg-gray-700"
                        : "bg-gray-800"
                        }  text-gray-300 py-4 px-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2`}
                    onClick={() => navigate(`/chatBlock?chatId=${chat.id}`)}
                >
                    <div className="flex gap-5 items-center">
                        <div className="flex flex-col">
                            <MdOutlineGroups2 />
                            {chat.name}
                        </div>
                        <span className="text-sm text-gray-400">
                            {chat.members?.map(member => member.user.firstName).join(", ")}
                        </span>
                    </div>
                </div>
            ))}
        </>
    );
}

export default GetChats;

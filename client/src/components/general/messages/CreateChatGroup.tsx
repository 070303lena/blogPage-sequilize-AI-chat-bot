import { useEffect, useState } from "react";
import { socket } from "../../../socket/socket";
import Modal from "../../ui/Modal";
import type { Chat, User } from "../../../types";
import Button from "../../ui/Button";

function CreateChatGroup({ setModalIsOpen, users, initialData }: { setModalIsOpen: any, users: any, initialData?: Chat }) {
    const [groupName, setGroupName] = useState<string | undefined>("");
    const [groupMembers, setGroupMembers] = useState<string[]>([]);

    useEffect(() => {
        if (initialData) {
            setGroupName(initialData.name);
            const memberIds = initialData.members.map((m: any) => (m.user_id));
            setGroupMembers(memberIds);
        } else {
            setGroupName("");
            setGroupMembers([])
        }
    }, [initialData])

    initialData
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!groupName?.trim() || groupMembers.length === 0) return;

        if (initialData) {
            socket.emit("update_chat", {
                id: initialData.id,
                groupName,
                groupMembers
            })
        } else {
            socket.emit("group_chat", { groupMembers, groupName });
        }
        setModalIsOpen(false);
    };

    return (
        <Modal
            title={`${initialData ? "Edit Chat group" : "Create chat group"}`}
            onClose={() => setModalIsOpen(false)}>
            <form
                onSubmit={(e) => handleSubmit(e)}
                className="flex flex-col gap-4"
            >
                <div className="flex flex-col gap-2">
                    <label className="font-bold">
                        Chat group name
                        <input
                            type="text"
                            className="w-full border p-1"
                            placeholder="Group Name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                        />
                    </label>
                    Select Members
                    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                        {users?.map((user: User) => (
                            <label className="font-bold" key={user.id}>
                                <div className="flex items-center gap-2 p-1 border border-gray-500 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        value={user.id}
                                        checked={groupMembers.includes(user.id)}
                                        onChange={() => {
                                            if (groupMembers.includes(user.id)) {
                                                setGroupMembers((prev) => prev.filter((id) => id !== user.id))
                                            } else {
                                                setGroupMembers((prev) => [...prev, user.id])
                                            }
                                        }}
                                    />
                                    {user.firstName}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
                <Button>{initialData ? "Edit Chat" : "Create Chat"}</Button>
            </form>
        </Modal>
    )
}

export default CreateChatGroup;

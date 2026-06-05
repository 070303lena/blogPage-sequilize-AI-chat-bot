import { useState } from "react";
import { api } from "../../../api/api";
import DelConfirmModal from "../../ui/DelConfirmModal";
import type { clearChatBot } from "../../../types";

function ClearChatBot({ setIsConfirmModalOpen, isConfirmModalOpen, setMessages }: clearChatBot) {
    const [deleting, setDeleting] = useState(false)

    const clearBotChatStory = () => {
        try {
            setIsConfirmModalOpen(false);
            setDeleting(true);
            api("botMessages/delete", { method: "DELETE" });
            setMessages([]);
        } catch (error) {
            console.log(error)
        }
        finally {
            setDeleting(false);
        }
    };
    return (
        <>
            {isConfirmModalOpen && (
                <DelConfirmModal
                    deleting={deleting}
                    closeDeleteModal={() => setIsConfirmModalOpen(false)}
                    deletePost={clearBotChatStory}
                />
            )}
        </>
    )
}

export default ClearChatBot;
function UpdatePost({ isAuthor, onEdit, onDelete }: {
    isAuthor: boolean;
    onEdit: () => void;
    onDelete: () => void;
}) {
    
    if (!isAuthor) return null;

    return (
        <div className="flex gap-5 items-center">
            <button
                className="text-white bg-gray-600 px-2 py-1 rounded-md cursor-pointer hover:bg-green-600"
                onClick={onEdit}
            >
                edit
            </button>

            <button
                className="text-white bg-gray-600 px-2 py-1 rounded-md cursor-pointer hover:bg-red-600"
                onClick={onDelete}
            >
                delete
            </button>
        </div>
    );
}
export default UpdatePost;

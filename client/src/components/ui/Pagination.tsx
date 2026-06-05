type Props = {
    totalPages: number;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

function Pagination({ totalPages, currentPage, setCurrentPage }: Props) {

    return (
        <div className="flex gap-2 mt-2">

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded cursor-pointer ${
                        currentPage === page
                            ? "bg-green-500 text-white"
                            : "bg-gray-300"
                    }`}
                >
                    {page}
                </button>
            ))}

        </div>
    );
}

export default Pagination;

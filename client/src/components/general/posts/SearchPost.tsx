import { useRef } from "react";
import type { searchProps } from "../../../types";

function SearchPost({ setSearch }: searchProps) {
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            setSearch(value);
        }, 1000);
    }

    return (
        <input
            type="search"
            placeholder="Search"
            className="border w-full py-1 px-3 text-white"
            onChange={handleChange}
        />
    );
}

export default SearchPost;

import { useEffect, } from "react"
import { api } from "../../../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Category } from "../../../types";

type Categories = {
    categoriesList: any;
    setCategoriesList: any
};

function GetProductCategories({ categoriesList, setCategoriesList }: Categories) {
    const [searchParams] = useSearchParams();
    const categoryType = searchParams.get("category");
    const navigate = useNavigate();

    const getCategories = async () => {
        try {
            const res = await api("products/category");
            const data = await res.json();
            setCategoriesList(data.result)

        } catch (error) {
            console.error("Error", error)
        }
    };

    useEffect(() => {
        getCategories()
    }, []);

    const handleChooseCategory = (category: Category) => {
        navigate(`${category.id}`)
        navigate(`?category=${category.name}`)
    };

    return (
        <>
            {categoriesList.map((category: any) => (
                <div
                    key={category.id}
                    className={`min-w-15 h-15 border rounded flex justify-center px-3
                         items-center  hover:text-gray-900 cursor-pointer ${categoryType === category.name ? "bg-gray-200 text-gray-700" : "hover:bg-gray-200"} `}
                    onClick={() => handleChooseCategory(category)}
                >
                    <span>{category.name}</span>
                </div>
            ))}
        </>
    )
}

export default GetProductCategories;

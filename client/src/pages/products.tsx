import { useEffect, useState } from "react";
import type { Category, Product } from "../types";
import { api } from "../api/api";
import Page from "../components/layout/Page";
import AddProductCategory from "../components/general/products/AddProductCategory";
import AddProducts from "../components/general/products/AddProducts";
import GetProductCategories from "../components/general/products/GetProductCategories";
import GetProducts from "../components/general/products/GetProducts";
import { useAuthContext } from "../provider/checkIsLoginProvider";
import { useNavigate } from "react-router-dom";

function Products() {
    const { user, isLogined } = useAuthContext();
    const isAdmin = user?.email === import.meta.env.VITE_ADMIN_MAIL;

    const [products, setProducts] = useState<Product[]>([]);
    const [categoriesList, setCategoriesList] = useState<Category[]>([]);
    const [hasSubscription, setHasSubscription] = useState<boolean>(false);

    const navigate = useNavigate();

    const getAllProducts = async () => {
        const res = await api("products");
        const data = await res.json();
        setProducts(data.result);
    };

    const subscribe = async () => {
        try {
            const res = await api("stripe/subscribe", { method: "POST" });
            const data = await res.json();
            window.location.href = data.url
        } catch (error) {
            console.log(error, "error");
        }
    };

    const getSubscriptionInfo = async () => {
        const res = await api("subscribe");
        const data = await res.json();
        setHasSubscription(!!data.hasSubscription);

    };

    useEffect(() => {
        getAllProducts();
        getSubscriptionInfo();
    }, []);

    return (
        <Page title="Products">
            <div className="flex flex-col border border-gray-500 w-[80%] min-h-[75vh]">
                <div
                    className={`text-white p-3 cursor-pointer ${hasSubscription ? "opacity-50" : "hover:bg-gray-100 hover:text-gray-700"}  self-start m-1`}
                    onClick={() => isLogined? (!hasSubscription ? subscribe : undefined) : navigate("/login")}
                >
                    {hasSubscription ? "You have subscription" : "Get Premium"}
                </div>
                <div className="w-full text-white pt-5">
                    <div className="text-center text-2xl">Choose the category</div>
                    <div className="flex gap-3 p-5">
                        <AddProductCategory
                            setCategoriesList={setCategoriesList}
                            isAdmin={isAdmin}
                        />
                        <GetProductCategories
                            setCategoriesList={setCategoriesList}
                            categoriesList={categoriesList}
                        />
                    </div>
                </div>
                <AddProducts
                    setProducts={setProducts}
                    getAllProducts={getAllProducts}
                    isAdmin={isAdmin}
                />
                <div className="w-full flex flex-wrap gap-10 p-5">
                    <GetProducts products={products} />
                </div>
            </div>
        </Page>
    )
}

export default Products;

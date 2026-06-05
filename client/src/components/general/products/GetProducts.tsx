import { useNavigate, useSearchParams } from "react-router-dom";
import { useCartContext } from "../../../provider/cartProvider";
import type { Product } from "../../../types";
import Button from "../../ui/Button";
import { api } from "../../../api/api";
import { useState } from "react";
import { useAuthContext } from "../../../provider/checkIsLoginProvider";

function GetProducts({ products }: { products: Product[] }) {

    const [searchParams] = useSearchParams();
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const categoryType = searchParams.get("category") || "";
    const { setCart } = useCartContext();
    const { isLogined } = useAuthContext();
    const navigate = useNavigate();
    const addToShoppingCart = async (product: Product) => {
        try {
            await api("cart/add", {
                method: "POST",
                item: {
                    productId: product.id,
                    quantity: quantities[product.id] || 1
                }
            });

            const res = await api("cart");
            const data = await res.json();
            setCart(data.result || []);
            setQuantities((prev) => ({
                ...prev,
                [product.id]: 1
            }))

        } catch (error) {
            console.error("Add to cart error:", error);
        }
    };

    const changeQuantity = (productId: number, delta: number) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: Math.max((prev[productId] || 1) + delta, 1)
        }));
    };

    const filtered = categoryType
        ? products.filter(p => p.categories?.name === categoryType)
        : products;

    return (
        <>
            {filtered.map((product) => {
                return (
                    <div key={product.id}
                        className="flex flex-col items-center rounded border-white w-[22%] min-h-60 bg-gray-100 py-2 gap-2 hover:scale-105 transition-all duration-300">
                        <img
                            src={`http://localhost:5000${product.image}`}
                            alt={product.title}
                            className="h-[65%] w-[90%] object-cover"
                        />
                        <div className="flex flex-col items-center">
                            <span className="font-bold">{product.title}</span>
                            <span className="italic text-gray-700">{product.price}$</span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => { changeQuantity(product.id, -1) }}
                                className="bg-gray-300 px-2 cursor-pointer hover:bg-gray-400"
                            >
                                -
                            </button>
                            <span>
                                Count: {quantities[product.id] || 1}
                            </span>

                            <button
                                className="bg-gray-300 px-2 cursor-pointer hover:bg-gray-400"
                                onClick={() => { changeQuantity(product.id, 1) }}
                            >
                                +
                            </button>
                        </div>
                        <Button
                            onClick={() => isLogined? (addToShoppingCart(product)): navigate("/login")}
                        >
                            Add to Cart
                        </Button>
                    </div >
                )
            })}
        </>
    )
}

export default GetProducts;

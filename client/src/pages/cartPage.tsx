import { useState } from "react";
import { IoTrashBin } from "react-icons/io5";
import { FaCartArrowDown } from "react-icons/fa";
import { IoMdPricetags } from "react-icons/io";
import { useCartContext } from "../provider/cartProvider";
import Page from "../components/layout/Page";
import Button from "../components/ui/Button";
import DelConfirmModal from "../components/ui/DelConfirmModal";
import { api } from "../api/api";
import type { CartItem } from "../types";
import UpdateQuantity from "../components/general/products/UpdateQuantity";

function CartPage() {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const { cart, setCart, totalCount } = useCartContext();
    const removeCartItem = async () => {
        if (selectedItemId === null) return;
        try {
            await api(`cart/${selectedItemId}`, {
                method: "DELETE",
            });

            const updatedCart = cart.filter(
                (c: CartItem) => c.id !== selectedItemId
            );
            setCart(updatedCart);
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.log(error);
        }
    };

    const addOrder = async () => {
        try {
            const res = await api("stripe/checkout", {
                method: "POST",
            });

            const data = await res.json();
            window.location.href = data.url;

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Page title="Shopping Cart">
            <div className="flex flex-col border border-white w-[40%] min-h-[75vh] gap-10 p-10">
                <span className="flex gap-2 items-center text-white text-2xl">
                    <FaCartArrowDown />
                    Added products:
                    <span>{totalCount}</span>
                </span>
                {cart.map((c: CartItem) => {
                    return (
                        <div
                            key={c.id}
                            className="flex w-full h-40 bg-gray-200 p-2 gap-2 rounded-xl hover:scale-95">
                            <div className="flex w-full bg-gray-200 p-2 gap-2">
                                <img
                                    src={`${import.meta.env.VITE_API_URL}${c.Product.image}`}
                                    alt={c.Product.title}
                                    className="h-full w-[30%] object-cover p-1"
                                />
                                <div className="flex flex-col justify-around">
                                    <span className="font-bold">Name: {c.Product.title}</span>
                                    <span className=" flex items-center gap-1 text-green-700">
                                        <IoMdPricetags />
                                        Price: {c.Product.price * c.quantity} $
                                    </span>
                                    <UpdateQuantity product={c} />
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setIsDeleteModalOpen(true)
                                    setSelectedItemId(c.id)
                                }}
                                className="cursor-pointer text-red-500 text-xl"
                            >
                                <IoTrashBin />
                            </button>
                        </div>
                    )
                })}
                <Button
                    onClick={addOrder}
                    disabled={cart.length === 0}
                >
                    Buy
                </Button>

                {isDeleteModalOpen &&
                    <DelConfirmModal
                        closeDeleteModal={() => setIsDeleteModalOpen(false)}
                        deletePost={removeCartItem}
                    />
                }
            </div>
        </Page>
    )
}

export default CartPage;

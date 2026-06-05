import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import type { AddProductsProps, newProduct, Product } from "../../../types";
import { api } from "../../../api/api";

function AddProducts({ setProducts, getAllProducts, isAdmin }: AddProductsProps) {
    const [addProductModalIsOpen, setAddProductModalIsOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchParams] = useSearchParams();

    const [newProduct, setNewProduct] = useState<newProduct>({
        name: "",
        price: 0,
        image: null,
    });

    const addProduct = () => {
        setAddProductModalIsOpen(true);
    };

    const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("name", newProduct.name);
            formData.append("price", String(newProduct.price));
            const getCategoryType = searchParams.get("category");
            formData.append("categoryName", getCategoryType ?? "");

            if (newProduct.image) {
                formData.append("image", newProduct.image);
            }

            const res = await api("products", {
                method: "POST", item: formData
            });
            if (!res.ok) {
                throw new Error("Failed to add product");
            }

            const data = await res.json();

            setProducts((prev: Product[]) => [...prev, data.result]);
            setAddProductModalIsOpen(false);
            setLoading(false);
            getAllProducts();
        } catch (error) {
            console.error(error);
        }
    };

    const categoryIsChoosen = searchParams.get("category");
    return (
        <>
            {categoryIsChoosen && isAdmin && (
                <button
                    className=" px-3 py-1 self-start border rounded flex justify-center m-5 items-center bg-gray-200 text-gray-900
                     hover:bg-gray-300 cursor-pointer"
                    onClick={addProduct}
                >
                    +
                </button>
            )}

            {addProductModalIsOpen && (
                <Modal title="Add new Product" onClose={() => setAddProductModalIsOpen(false)}>
                    <form
                        onSubmit={handleAddProduct}
                        className="flex flex-col border border-gray-400 min-h-30 gap-5 w-70 p-3 text-gray-800"
                    >
                        <label className="text-l font-bold">
                            Product Name
                            <input
                                required
                                type="text"
                                className="border px-2 py-1 w-full text-sm font-normal"
                                placeholder="Enter the name"
                                onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                            />
                        </label>
                        <label className="text-l font-bold">
                            Price
                            <input
                                required
                                type="number"
                                className="border px-2 py-1 w-full text-sm font-normal"
                                placeholder="USD 0.00"
                                onChange={(e) => setNewProduct((prev) => ({ ...prev, price: Number(e.target.value) }))}
                            />
                        </label>
                        <label className="text-l font-bold">
                            Choose the product photo
                            <input
                                required
                                type="file"
                                accept="image/*"
                                className="border px-2 py-1 w-full text-sm font-normal"
                                onChange={(e) => setNewProduct((prev) => ({
                                    ...prev, image: e.target.files?.[0] || null,
                                }))}
                            />
                        </label>
                        <Button disabled={loading}>Add</Button>
                    </form>
                </Modal>
            )}
        </>
    )
}

export default AddProducts;

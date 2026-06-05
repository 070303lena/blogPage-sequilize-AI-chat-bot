import { api } from "../../../api/api";
import { useCartContext } from "../../../provider/cartProvider";

function UpdateQuantity({ product }: any) {

    const { setCart } = useCartContext();

    const updateQuantity = async (itemId: number, quantity: number) => {
        setCart(prev =>
            prev.map(item =>
                item.id === itemId
                    ? { ...item, quantity }
                    : item
            )
        );

        await api(`cart/${itemId}`, {
            method: "PATCH",
            item: { quantity }
        });
    };
    return (
        <div className="flex gap-2">
            <button
                onClick={() => {
                    if (!product.quantity || product.quantity <= 1) return;
                    updateQuantity(product.id, product.quantity - 1)
                }}
                className="bg-gray-300 px-2 cursor-pointer hover:bg-gray-400"
            >
                -
            </button>
            <span>Count: {product.quantity}</span>

            <button
                className="bg-gray-300 px-2 cursor-pointer hover:bg-gray-400"
                onClick={() => {
                    if (!product.quantity) return;
                    updateQuantity(product.id, product.quantity + 1)
                }
                }
            >
                +
            </button>
        </div>



    )
};

export default UpdateQuantity;

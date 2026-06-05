import { useEffect, useState } from "react";
import Page from "../components/layout/Page";
import { api } from "../api/api";
import type { Order } from "../types";
import { IoPricetags } from "react-icons/io5";

function OrdersPage() {
    const [ordersList, setOrdersList] = useState<Order[]>([]);

    const getOrdersList = async () => {
        try {
            const res = await api("order");
            const data = await res.json();
            setOrdersList(data);
        } catch (error) {
            console.log(error, "error");
        }
    };

    useEffect(() => {
        getOrdersList();
    }, []);

    return (
        <Page title="Orders list">
            <div className="w-full flex justify-center">
                <div className="w-[30%] flex flex-col gap-6">
                    {ordersList.map(order => (
                        <div
                            key={order.id}
                            className="bg-gray-900/40 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <p className="font-bold text-xl text-white">
                                    Order #{order.id}
                                </p>

                                <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-300 border border-green-500/40">
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-gray-300 mb-4">
                                Total:{" "}
                                <span className="text-white font-semibold">
                                    {order.totalPrice}$
                                </span>
                            </p>

                            <div className="flex flex-col gap-2">
                                {order.items?.map(item => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-center bg-gray-800/40 border border-gray-700 rounded-lg p-3"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-gray-300 text-sm">
                                                Product ID
                                            </span>
                                            <span className="text-white font-medium">
                                                #{item.product_id}
                                            </span>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <span className="text-gray-300 text-sm">
                                                Qty
                                            </span>
                                            <span className="text-white font-medium">
                                                {item.quantity}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <IoPricetags />
                                            <span className="text-white">
                                                {item.price}$
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Page>
    )
}

export default OrdersPage;

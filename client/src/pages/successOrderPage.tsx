import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

function SuccessOrderPage() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-green-50 via-white to-green-100">
            <div className="w-90 rounded-2xl border border-green-200 bg-white p-6 shadow-xl flex flex-col items-center gap-4">
                <div className="flex justify-center text-5xl text-green-600"><IoCheckmarkDoneCircleOutline /></div>
                <h1 className="text-2xl font-semibold text-gray-800 text-center">
                    Payment  successful!
                </h1>
                <p className="text-gray-500 text-center text-sm">
                    Your payment has been completed
                </p>
                <Button onClick={() => navigate("/products")}>
                    Finish
                </Button>
            </div>
        </div>
    )
}

export default SuccessOrderPage;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TbMessageUp } from "react-icons/tb";
import { useAuthContext } from "../../provider/checkIsLoginProvider";
import Button from "../ui/Button";
import { FaCartShopping } from "react-icons/fa6";

function Header() {
    const { isLogined, setIsLogined, setUser, user } = useAuthContext();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const navigate = useNavigate();

    const handleLogOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLogined(false);
        setIsLogoutModalOpen(false);
        setUser(null);
        navigate("/");
    };

    return (
        <header className="h-15 w-full bg-gray-800 flex items-center justify-between px-10">
            <span className="text-2xl bg-linear-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent cursor-pointer">
                <Link to="/">
                    yourBlog
                </Link>
            </span>
            <div className="flex text-white gap-5 items-center">
                <span
                    className="cursor-pointer"
                    onClick={() => navigate("/products")}
                >
                    Products
                </span>
                {isLogined ? (
                    <>
                        <Link to="/cart" className="text-xl cursor-pointer" ><FaCartShopping /></Link>
                        <Link to="/chatBlock">
                            <TbMessageUp className="text-xl cursor-pointer" />
                        </Link >
                        <Link to="/userProfile">Profile</Link>
                        <span
                            className="cursor-pointer hover:text-gray-300 bg-transparent border-none outline-none"
                            onClick={() => setIsLogoutModalOpen(true)}
                        >
                            Log Out
                        </span>
                        <span className="font-bold text-gray-400">{user?.firstName}</span>
                    </>
                ) : (
                    <Link to="/login" className="hover:text-gray-300">
                        Log In
                    </Link>
                )}

                {isLogoutModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-10">
                        <div className="bg-white w-100 p-6 rounded flex flex-col gap-3 text-black">
                            <h2 className="font-bold text-2xl">Logout confirmation</h2>
                            <span>Are you sure you want to logout </span>
                            <Button type="submit" variant="danger" onClick={handleLogOut}>Log Out</Button>
                            <Button type="button" onClick={() => setIsLogoutModalOpen(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </header >
    )
}

export default Header;

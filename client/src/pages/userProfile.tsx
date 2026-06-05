import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Post, User } from "../types";
import { api } from "../api/api";
import Page from "../components/layout/Page";
import Button from "../components/ui/Button";
import PostComponent from "../components/general/posts/PostComponent";

function UserProfile() {
    const [userData, setUserData] = useState<User | null>(null);
    const [usersPosts, setUsersPosts] = useState<Post[]>([]);
    const [isChanging, setIsChanging] = useState(false);
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        const getUserInfo = async () => {
            const res = await api("userProfile");

            if (!res.ok) {
                throw new Error("Error while receiving data");
            }

            const data = await res.json();

            setUserData(data.result.user);

            setUsersPosts(data.result.userPosts);
            return data;
        };
        getUserInfo();
    }, []);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await api("changePassword", {
                method: "POST",
                item: passwords,
            });

            if (res.ok) {
                setMessage("Password changed successfully");
                setPasswords({ oldPassword: "", newPassword: "" });

                setTimeout(() => {
                    setIsChanging(false);
                    setMessage("");
                }, 1500);
            }
            else {
                const errorData = await res.json();
                setMessage(errorData.message || "Error changing password");
            }
        } catch (error) {
            setMessage("Error with server");
        }
    };

    return (
        <Page title="Your Page">
            <div className="flex w-full gap-20 ">
                <div className="w-[20%] h-[10%] flex">
                    {userData ? (
                        <div className="flex flex-col w-full bg-white gap-2 p-7">
                            <h2 className="text-2xl font-bold">Personal information</h2>
                            <span className="text-l">First name: {userData.firstName}</span>
                            <span className="text-l">Last name: {userData.lastName}</span>
                            <span className="text-l">Email: {userData.email}</span>
                            <Link to="/orders" className="bg-gray-300 hover:bg-gray-400 p-2">Your orders</Link>
                            <Link to="/likedPosts" className="bg-gray-300 hover:bg-gray-400 p-2">Liked posts</Link>

                            <Button onClick={() => setIsChanging(true)}>Change password</Button>
                        </div>
                    ) :
                        (<p> Loading data...</p>)
                    }

                    {isChanging && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/80">
                            <form
                                onSubmit={handleChangePassword}
                                className="bg-white p-6 rounded flex flex-col gap-3"
                            >
                                <h3 className="text-xl font-bold">Change Password</h3>

                                <label htmlFor="oldPassword" className="flex flex-col">
                                    Old password
                                    <input
                                        type="password"
                                        placeholder="Old password"
                                        id="oldPassword"
                                        value={passwords.oldPassword}
                                        onChange={(e) =>
                                            setPasswords({ ...passwords, oldPassword: e.target.value })
                                        }
                                        className="border p-2"
                                    />
                                </label>
                                <label htmlFor="newPassword" className="flex flex-col">
                                    New password
                                    <input
                                        type="password"
                                        id="newPassword"
                                        placeholder="New password"
                                        value={passwords.newPassword}
                                        onChange={(e) =>
                                            setPasswords({ ...passwords, newPassword: e.target.value })
                                        }
                                        className="border p-2"
                                    />
                                </label>

                                <div className="flex gap-2">
                                    <Button type="submit" variant="primary">Save</Button>
                                    <Button type="button" onClick={() => setIsChanging(false)}>
                                        Cancel
                                    </Button>
                                </div>
                                {message && <p>{message}</p>}
                            </form>
                        </div>
                    )}
                </div>

                <div className="flex flex-col flex-1 min-h-[70vh] overflow-auto gap-10">
                    <h2 className="text-3xl font-bold text-gray-400 text-center">Posts</h2>
                    {usersPosts.map((post: Post) => (
                        <PostComponent key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </Page >
    );
};

export default UserProfile;

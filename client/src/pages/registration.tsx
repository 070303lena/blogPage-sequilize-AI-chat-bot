import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types";
import { api } from "../api/api";
import Page from "../components/layout/Page"
import Button from "../components/ui/Button";
import { useAuthContext } from "../provider/checkIsLoginProvider";

function Registration() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const { setIsLogined, setUser } = useAuthContext();
    const [loading, setLoading] = useState(false);

    const [newUser, setNewUser] = useState<User>(
        {
            id: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            createdAt: "",
            updatedAt: ""
        }
    );

    const { confirmPassword, ...userToSend } = newUser;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loading) return;
        setLoading(true);
        if (newUser.password !== newUser.confirmPassword) {
            setErrorMessage("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const response = await api("register", {
                method: "POST",
                item: userToSend,
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || "Registration failed");
                return;
            }

            const getLogined = await api("login", { method: "POST", item: { email: newUser.email, password: newUser.password } });
            const login = await getLogined.json();

            if (login.result?.token) {
                localStorage.setItem("token", login.result.token);

                localStorage.setItem(
                    "user",
                    JSON.stringify(login.result.user)
                );

                setUser(login.result.user);

                setIsLogined(true);
                navigate("/");
            }

        } catch (error) {
            setErrorMessage((error as Error).message);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Page title="Get started on yourBlog">
            <div className="flex flex-col text-gray-400 border-2 border-dotted w-110 gap-4 p-6">
                <form
                    onSubmit={handleRegister}
                    className="flex flex-col gap-4">
                    <label htmlFor="user_firstName">
                        First Name
                        <input
                            type="text"
                            id="user_firstName"
                            className="border p-2 w-full"
                            placeholder="Input your Name"
                            required
                            value={newUser.firstName}
                            onChange={(e) => setNewUser((prev) => ({ ...prev, firstName: e.target.value }))}
                        />
                    </label>
                    <label htmlFor="user_lastName">
                        Last Name
                        <input
                            type="text"
                            id="user_lastName"
                            className="border p-2 w-full"
                            placeholder="Input your Surname"
                            required
                            value={newUser.lastName}
                            onChange={(e) => setNewUser((prev) => ({ ...prev, lastName: e.target.value }))}
                        />
                    </label>
                    <label htmlFor="user_email">
                        Email
                        <input
                            type="email"
                            id="user_email"
                            className="border p-2 w-full"
                            placeholder="Input your Email"
                            required
                            value={newUser.email}
                            onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                        />
                    </label>
                    <label htmlFor="user_password" className="flex flex-col gap-3">
                        Password
                        <input
                            type="password"
                            id="user_password"
                            className="border p-2 w-full"
                            placeholder="Password"
                            required
                            value={newUser.password}
                            onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
                        />
                        <input
                            type="password"
                            className="border p-2 w-full"
                            placeholder="Repeat password"
                            required
                            value={newUser.confirmPassword}
                            onChange={(e) => setNewUser((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        />
                    </label>
                    <span className="text-red-700">{errorMessage}</span>
                    <Button type="submit" variant="primary" disabled={loading}>Submit</Button>
                </form>
                <Button onClick={() => navigate("/login")}>I already have an account</Button>
            </div>
        </Page>
    )
}

export default Registration;

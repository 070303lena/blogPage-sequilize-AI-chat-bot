import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../provider/checkIsLoginProvider";
import { api } from "../api/api";
import type { loginFormData } from "../types";
import Button from "../components/ui/Button"
import Page from "../components/layout/Page"
import Notifications from "../components/ui/Notification";

function Login() {
    const navigate = useNavigate();
    const { setIsLogined, setUser } = useAuthContext();
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [loginFormData, setLoginFormData] = useState<loginFormData>(
        {
            email: "",
            password: ""
        }
    );

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await api("login", { method: "POST", item: loginFormData });
            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || "Error password or login");
                return;
            }

            if (data.result && data.result.token) {
                setUser(data.result.user);

                localStorage.setItem("token", data.result.token);
                localStorage.setItem("user", JSON.stringify(data.result.user));

                setIsLogined(true);
                navigate("/");

            }

        } catch (error) {
            console.log(error);
            setErrorMessage(error as string);
        }
    };

    useEffect(() => {
        console.log(errorMessage);

    }, [errorMessage])
    return (
        <Page title="Log into yourBlog">
            <div className="flex flex-col text-gray-400 border-2 border-dotted w-110 gap-4 p-6">
                <form
                    className="flex flex-col gap-4"
                    onSubmit={handleLogin}
                >
                    <label htmlFor="user_email">
                        Email
                        <input
                            type="email"
                            id="user_email"
                            className="border p-2 w-full"
                            placeholder="Input your Email"
                            required
                            onChange={(e) => setLoginFormData((prev) => ({ ...prev, email: e.target.value }))}
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
                            onChange={(e) => setLoginFormData((prev) => ({ ...prev, password: e.target.value }))}
                        />
                    </label>

                    {errorMessage && (
                        <>
                            <Notifications message={errorMessage} />
                            <span className="text-red-600">
                                {errorMessage}
                            </span>
                        </>
                    )}
                    <Button variant="primary">Log in</Button>
                </form>
                <Button onClick={() => navigate("/registration")}>Create New Account</Button>
            </div>
        </Page>
    )
}

export default Login;

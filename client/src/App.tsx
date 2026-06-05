import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
import PostPage from "./pages/postPage";
import CreatePostPage from "./pages/createPostPage";
import Registration from "./pages/registration";
import Login from "./pages/login";
import LikedPosts from "./pages/likedPosts";
import UserProfile from "./pages/userProfile";
import ChatPage from "./pages/chatPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { useAuthContext } from "./provider/checkIsLoginProvider";
import Products from "./pages/products";
import CartPage from "./pages/cartPage";
import SuccessOrderPage from "./pages/successOrderPage";
import { CartContextProvider } from "./provider/cartProvider";
import OrdersPage from "./pages/ordersPage";

function App() {
  const { isLogined, loading } = useAuthContext();
  return (
    <BrowserRouter>
      <CartContextProvider>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/posts/:id" element={<PostPage />} ></Route>
          <Route path="/registration" element={<Registration />} ></Route>
          <Route path="/login" element={<Login />} ></Route>
          <Route path="/products" element={<Products />} ></Route>
          <Route element={<ProtectedRoute isLogined={isLogined} loading={loading} />}>
            <Route path="/create-post" element={<CreatePostPage />} ></Route>
            <Route path="/likedPosts" element={<LikedPosts />} ></Route>
            <Route path="/userProfile" element={<UserProfile />} ></Route>
            <Route path="/chatBlock" element={<ChatPage />} ></Route>
            <Route path="/cart" element={<CartPage />} ></Route>
            <Route path="/success" element={<SuccessOrderPage />} ></Route>
            <Route path="/orders" element={<OrdersPage />} ></Route>
          </Route>
        </Routes>
      </CartContextProvider>
    </BrowserRouter>
  );
}

export default App;

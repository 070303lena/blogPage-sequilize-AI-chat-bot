import type { Dispatch, SetStateAction } from "react";

export interface Post {
    id: number;
    title: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    liked: boolean;
    author_id: string;

    User?: {
        id: number;
        firstName: string;
    };
};

export interface apiProps {
    url?: string;
    method?: string;
    item?: any;
    id?: string;
    params?: any
};

export interface PostsContextType {
    posts: Post[];
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

export type PostFormProps = {
    newPost: Post;
    setNewPost: React.Dispatch<React.SetStateAction<Post>>;
    addNewPost: (e: React.FormEvent) => void;
    editingPost?: Post;
    loading?: boolean
};

export interface DelConfirmModalProps {
    deletePost: () => void;
    closeDeleteModal: () => void;
    deleting?: boolean;
};

export type searchProps = {
    search: string;
    setSearch: (value: string) => void;
};

export interface paramsProps {
    page?: string | undefined,
    limit?: string | undefined,
    title?: string | undefined
};

export interface notificiationProps {
    message: string | undefined,
    position?: "topRight" | "topLeft" | "bottomLeft" | "bottomRight",
    duration?: number
};

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    createdAt: string;
    updatedAt: string;
};

export interface loginFormData {
    email: string;
    password: string;
};

export interface AuthContextDataType {
    isLogined: boolean;
    setIsLogined: React.Dispatch<React.SetStateAction<boolean>>
    user: {
        id: number,
        firstName: string,
        lastName: string,
        email: string
    }
    | null;
    setUser: React.Dispatch<React.SetStateAction<{ id: string } | null>>;
    loading: boolean;
};

export type Message = {
    id: number;
    text: string;
    from: "me" | "other";
    createdAt?: string;
    sender_id: number;
};

export interface SendMessagesProps {
    chatId: number | null;
    message: string;
    setMessage: (value: string) => void;
};

type ChatMember = {
    chat_id: number;
    user_id: number;
    user: User;
};

export interface Chat {
    id: number;
    type: "private" | "group";
    name?: string;
    createdAt: string;
    members: ChatMember[];
}

export interface GetChatsProps {
    users: User[];
    receiverId: number | null;
    setUsers: (users: User[]) => void;
    chats: Chat[];
    setChats: Dispatch<SetStateAction<Chat[]>>;
};

export type GetMessagesProps = {
    currentChat: any;
    currentChatName: string;
    user: any;
    messages: any[];
    setMessages: React.Dispatch<React.SetStateAction<any[]>>;
    normalizeMessage: (msg: any, userId: number) => any;
    chatId: number | null;
    users: any[]
    isPartnerTyping: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    typingPartnerId: number | null;
};

export type Category = {
    id: number;
    name: string;
};

export type Product = {
    id: number,
    title: string,
    price: number,
    image: string
    categories: Category
    quantity?: number | undefined
};

export type newProduct = {
    name: string,
    price: number,
    image: File | null
};

export interface CartItem {
    id: number;
    productId: number;
    quantity: number;
    Product: {
        title: string;
        image: string;
        price: number;
    };
}

export interface AddProductsProps {
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    getAllProducts: any
    isAdmin: boolean
};

export type order_item_type = {
    id: number;
    product_id: number;
    price: number;
    quantity: number;
};

export type Order = {
    id: number,
    status: string,
    totalPrice: number,
    items: order_item_type[]
};

export type botChatMessages = {
    id?: number,
    role: "user" | "assistant",
    content: string
};

export type clearChatBot = {
    setIsConfirmModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isConfirmModalOpen: boolean,
    setMessages: React.Dispatch<React.SetStateAction<botChatMessages[]>>
};
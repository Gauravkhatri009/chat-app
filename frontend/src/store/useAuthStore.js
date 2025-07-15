import { create } from "zustand";
import axiosInstance from "../sercices/axiosInstance.js"
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5000";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isChechingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check", { withCredentials: true });

            set({ authUser: res.data });
            //get().connectSocket();
            get().connectSocket(res.data);
        } catch (err) {
            console.log("Error in checkAuth", err)
            set({ authUser: null })
        } finally {
            set({ isChechingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/register", data);
            set({ authUser: res.data });
            toast.success("Account created successfully.");

            //get().connectSocket();
            get().connectSocket(res.data);

            // Force reload to ensure socket + state sync
            window.location.reload();
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully.");

            // get().connectSocket()
            get().connectSocket(res.data);

            // Force reload to ensure socket + state sync
            window.location.reload();
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.post("/auth/logout");
            get().disconnectSocket();
            set({ authUser: null });
            toast.success("Logged out successfully.")

        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {

            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully.")

        } catch (error) {
            console.log("Error in updating profile", error);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: (user) => {
        if (!user || get().socket?.connected) return;
        console.log("🧠 Trying to connect socket for user:", user._id);

        const socket = io(BASE_URL, {
            query: {
                userId: user._id,
            },
            withCredentials: true,
        });

        socket.connect();
        set({ socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });

        socket.on("connect", () => {
            console.log("✅ Socket connected:", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("❌ Socket disconnected");
        });
    },


    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },

}))
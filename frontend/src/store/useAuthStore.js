import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((setterFn, getterFn) => ({
  authUser: null,
  isSigningUp: false,
  isLogginIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  isCheckingAuth: true,
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      setterFn({ authUser: res.data });
      getterFn().connectSocket();
    } catch (err) {
      console.log(`Error in checkAuth:`, err);
      setterFn({ authUser: null });
    } finally {
      setterFn({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    setterFn({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      setterFn({ authUser: res.data });
      toast.success("Account created successfully!!");

      getterFn().connectSocket();
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setterFn({ isSigningUp: false });
    }
  },

  login: async (data) => {
    setterFn({ isLogginIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      setterFn({ authUser: res.data });
      toast.success("Logged In successfully!!");

      getterFn().connectSocket();
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setterFn({ isLogginIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setterFn({ authUser: null });
      toast.success("Logged out successfully!!");
      getterFn().disconnectSocket();
    } catch (err) {
      toast.error(err.response.data.message);
    }
  },

  updateProfile: async (data) => {
    setterFn({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      setterFn({ authUser: res.data });
      toast.success("Profile updated successfully!!");
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setterFn({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = getterFn();

    if (!authUser || getterFn.socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    setterFn({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      setterFn({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (getterFn().socket?.connected) getterFn().socket.disconnect();
  },
}));

import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((setterFn, getterFn) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    setterFn({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      setterFn({ users: res.data });
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setterFn({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    setterFn({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      setterFn({ messages: res.data });
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setterFn({ isMessagesLoading: false });
    }
  },

  sendMessage: async (data) => {
    const { selectedUser, messages } = getterFn();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        data
      );
      setterFn({ messages: [...messages, res.data] });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  },

  listenToMessages: () => {
    const { selectedUser } = getterFn();

    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;

      setterFn({
        messages: [...getterFn().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => setterFn({ selectedUser }),
}));

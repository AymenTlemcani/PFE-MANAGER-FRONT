import { create } from "zustand";

type SnackbarType = "success" | "error" | "info" | "warning";

interface SnackbarMessage {
  id: number;
  message: string;
  type: SnackbarType;
}

interface SnackbarStore {
  messages: SnackbarMessage[];
  addMessage: (message: string, type: SnackbarType) => void;
  removeMessage: (id: number) => void;
}

export const useSnackbarStore = create<SnackbarStore>((set) => ({
  messages: [],
  addMessage: (message: string, type: SnackbarType) => {
    const id = Date.now();
    // Clear previous messages if this is a success message
    set((state) => ({
      messages:
        type === "success"
          ? [{ id, message, type }]
          : [...state.messages, { id, message, type }],
    }));
    setTimeout(() => {
      set((state) => ({
        messages: state.messages.filter((msg) => msg.id !== id),
      }));
    }, 5000);
  },
  removeMessage: (id: number) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== id),
    })),
}));

export const useSnackbar = () => {
  const { addMessage, removeMessage, messages } = useSnackbarStore();

  const showSnackbar = (message: string, type: SnackbarType = "info") => {
    // Remove info messages when showing success
    if (type === "success") {
      messages
        .filter((msg) => msg.type === "info")
        .forEach((msg) => removeMessage(msg.id));
    }
    addMessage(message, type);
  };

  return { showSnackbar, removeSnackbar: removeMessage, messages };
};

import { create } from "zustand";

interface Inbox {
  id: string;
  email_address: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  password_hash?: string | null;
  custom_name?: string | null;
}

interface InboxState {
  inboxes: Inbox[];
  setInboxes: (inboxes: Inbox[]) => void;
  addInbox: (inbox: Inbox) => void;
  deleteInbox: (inboxId: string) => void;
  fetchInboxes: () => Promise<void>;
}

export const useInboxStore = create<InboxState>((set) => ({
  inboxes: [],
  setInboxes: (inboxes) => set({ inboxes }),
  addInbox: (inbox) => set((state) => ({ inboxes: [inbox, ...state.inboxes] })),
  deleteInbox: (inboxId) =>
    set((state) => ({
      inboxes: state.inboxes.filter((inbox) => inbox.id !== inboxId),
    })),
  fetchInboxes: async () => {
    try {
      const response = await fetch("/api/getInboxes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch inboxes");
      }

      const result = await response.json();

      if (result.success) {
        set({ inboxes: result.inboxes });
      } else {
        console.error("Error fetching inboxes:", result.error);
      }
    } catch (error) {
      console.error("Error in fetchInboxes:", error);
    }
  },
}));

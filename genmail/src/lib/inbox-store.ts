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
  fetchInboxes: (userId: string, supabase: any) => Promise<void>;
}

export const useInboxStore = create<InboxState>((set, get) => ({
  inboxes: [],
  setInboxes: (inboxes) => set({ inboxes }),
  addInbox: (inbox) => set((state) => ({ inboxes: [inbox, ...state.inboxes] })),
  deleteInbox: (inboxId) =>
    set((state) => ({
      inboxes: state.inboxes.filter((inbox) => inbox.id !== inboxId),
    })),
  fetchInboxes: async (userId, supabase) => {
    try {
      const { data, error } = await supabase
        .from("inboxes")
        .select(
          "id, email_address, created_at, expires_at, is_active, password_hash, custom_name"
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching inboxes:", error);
        return;
      }

      const activeInboxes = (data || []).filter(
        (inbox: Inbox) => new Date(inbox.expires_at) > new Date()
      );
      set({ inboxes: activeInboxes });
    } catch (error) {
      console.error("Error in fetchInboxes:", error);
    }
  },
}));

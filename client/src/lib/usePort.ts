import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


interface PortState {
    port: number;
    setPort: (port: number) => void;
}

export const usePort = create<PortState>()(
    persist(
        (set) => ({
            port: 9000,
            setPort: (port: number) => set({ port }),
        }),
        {
            name: "port-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
)
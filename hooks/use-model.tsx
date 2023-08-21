import { create } from "zustand"

interface UseModelStore {
    isOpen : boolean ;
    onOpen : () => void ;
    onClose : () => void;
}


export const useProModel = create<UseModelStore>((set) => ({
    isOpen : false,
    onOpen : () => set({ isOpen : true }),
    onClose : () => set({ isOpen : false }),
 
}))
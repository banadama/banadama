'use client';

import { ReactNode, createContext, useContext, useState } from 'react';

type ModalType = 'register' | 'login' | null;

interface ModalContextType {
    modal: ModalType;
    openModal: (type: ModalType) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [modal, setModal] = useState<ModalType>(null);

    return (
        <ModalContext.Provider
            value={{
                modal,
                openModal: (type) => setModal(type),
                closeModal: () => setModal(null),
            }}
        >
            {children}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within ModalProvider');
    }
    return context;
}

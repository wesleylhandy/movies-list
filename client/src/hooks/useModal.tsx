import React, { ReactNode, Dispatch, useContext, useState } from "react";

export interface ModalCreatedContext {
  isModalClosed: boolean;
  setIsModalClosed: Dispatch<boolean>;
  title: string;
  setTitle: Dispatch<string>;
  modalContent?: ReactNode;
  setModalContent: Dispatch<ReactNode | undefined>;
}

const ModalContext = React.createContext<ModalCreatedContext | undefined>(
  undefined
);

export interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps): JSX.Element {
  const [isModalClosed, setIsModalClosed] = useState<boolean>(true);
  const [title, setTitle] = useState<string>("Modal");
  const [modalContent, setModalContent] = useState<ReactNode | undefined>();

  return (
    <ModalContext.Provider
      value={{
        isModalClosed,
        setIsModalClosed,
        setTitle,
        title,
        modalContent,
        setModalContent,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal(
  title?: string,
  isClosed?: boolean
): ModalCreatedContext {
  const context = useContext(ModalContext);
  if (typeof context === "undefined") {
    throw new Error("useModal must be used within a ModalProvider");
  }

  if (typeof title !== "undefined" && title !== context.title) {
    context.setTitle(title);
  }

  if (typeof isClosed !== "undefined" && isClosed !== context.isModalClosed) {
    context.setIsModalClosed(isClosed);
  }

  return context;
}

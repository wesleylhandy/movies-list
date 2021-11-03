import * as React from "react";
import { DispatchAssign, useAssignReducer } from "./useAssignReducer";

export interface ModalInnerState {
  isModalClosed: boolean;
  title: string;
  modalContent?: React.ReactNode;
}

export interface ModalCreatedContext extends ModalInnerState {
  modalDispatch: DispatchAssign<ModalInnerState>
}

const ModalContext = React.createContext<ModalCreatedContext | undefined>(
  undefined
);

export interface ModalProviderProps {
  children: React.ReactNode;
}

function initialModalState(): ModalInnerState {
  return {
    isModalClosed: true,
    title: "Modal",
    modalContent: undefined,
  }
}

export function ModalProvider({ children }: ModalProviderProps): JSX.Element {
  const [innerModalState, modalDispatch] = useAssignReducer(initialModalState());

  return (
    <ModalContext.Provider
      value={{
        ...innerModalState,
        modalDispatch,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal(
  title?: string,
  isModalClosed?: boolean
): ModalCreatedContext {
  const context = React.useContext(ModalContext);
  if (typeof context === "undefined") {
    throw new Error("useModal must be used within a ModalProvider");
  }

  if (typeof title !== "undefined" && title !== context.title) {
    context.modalDispatch({ title });
  }

  if (typeof isModalClosed !== "undefined" && isModalClosed !== context.isModalClosed) {
    context.modalDispatch({ isModalClosed });
  }

  return context;
}

import { MdClear } from "react-icons/md";
import { motion } from "framer-motion";
import { useModal } from "../hooks/useModal";
import useOnClickOutside from "use-onclickoutside";
import * as React from "react";
import { Portal } from "./Portal";

export interface ModalProps {
  testId?: string;
}

const defaultProductModalProps: Pick<ModalProps, "testId"> = {
  testId: undefined,
};

export function MovieModal(props: ModalProps): JSX.Element | null {
  const { testId } = props;
  const modalRef = React.useRef<HTMLDivElement>(null);
  const closeModalRef = React.useRef<HTMLButtonElement>(null);
  const { title, isModalClosed, modalDispatch, modalContent } = useModal();

  useOnClickOutside(modalRef, () => {
    modalDispatch({ isModalClosed: true });
  });

  React.useEffect(() => {
    if (
      closeModalRef.current !== null
      && closeModalRef.current !== document.activeElement
      && !isModalClosed
    ) {
      closeModalRef.current.focus();
    }
  }, [isModalClosed]);

  if (isModalClosed || !modalContent) {
    return null;
  }

  function handleCloseClick(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    modalDispatch({ isModalClosed: true });
  }
  return (
    <Portal>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        transition={{
          type: "spring",
          mass: 0.35,
          stiffness: 75,
          duration: 0.3,
        }}
        className="fixed left-0 top-0 z-10 bg-translucent w-screen h-screen m-0 sm:my-5 p-0 sm:py-5 overflow-scroll"
        data-testid={testId}
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 100,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -100,
          }}
          transition={{
            type: "spring",
            delay: 0.25,
            mass: 0.35,
            stiffness: 75,
            duration: 0.3,
          }}
          className="bg-light w-full max-w-screen-lg m-auto h-auto"
        >
          <div ref={modalRef} className="w-full bg-gray-100 m-0 p-6 flex">
            <h2 id="modal-title">{title}</h2>
            <button
              ref={closeModalRef}
              className="ml-auto bg-transparent text-2xl"
              type="button"
              onClick={handleCloseClick}
              title="Close Modal"
              aria-label="Close Modal"
              autoFocus={!isModalClosed}
            >
              <MdClear />
            </button>
          </div>
          <div className="w-full m-0 p-6 pb-10 bg-gray-100">{modalContent}</div>
        </motion.div>
      </motion.div>
    </Portal>
  );
}

MovieModal.defaultProps = defaultProductModalProps;

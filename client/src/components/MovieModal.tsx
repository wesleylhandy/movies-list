import { MdClear } from "react-icons/md";
import { motion } from "framer-motion";
import { useModal } from "../hooks/useModal";
import useOnClickOutside from "use-onclickoutside";
import { useRef } from "react";
import { Portal } from "./Portal";

export interface ModalProps {
  testId?: string;
}

const defaultProductModalProps: Pick<ModalProps, "testId"> = {
  testId: undefined,
};

export function MovieModal(props: ModalProps): JSX.Element | null {
  const { testId } = props;
  const ref = useRef(null);
  const { title, isModalClosed, setIsModalClosed, modalContent } = useModal();

  useOnClickOutside(ref, () => {
    setIsModalClosed(true);
  });

  if (isModalClosed || !modalContent) {
    return null;
  }

  function handleCloseClick(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    setIsModalClosed(true);
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
        className="fixed left-0 top-0 z-10 bg-translucent w-screen h-screen m-0 sm:my-5 p-o sm:py-5"
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
          <div ref={ref} className="w-full bg-gray-100 m-0 p-6 flex">
            <h2 id="modal-title">{title}</h2>
            <button
              className="ml-auto bg-transparent text-2xl"
              type="button"
              onClick={handleCloseClick}
              title="Close Modal"
              aria-label="Close Modal"
              autoFocus
            >
              <MdClear />
            </button>
          </div>
          <div className="w-full m-0 p-6 bg-gray-100">{modalContent}</div>
        </motion.div>
      </motion.div>
    </Portal>
  );
}

MovieModal.defaultProps = defaultProductModalProps;

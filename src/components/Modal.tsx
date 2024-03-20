import { ReactNode, useEffect, useRef } from "react";

//https://medium.com/@dimterion/modals-with-html-dialog-element-in-javascript-and-react-fb23c885d62e

function Modal({
  closeModal,
  cleanUpFunc,
  buttonName,
  buttonClass,
  children,
}: {
  closeModal?: boolean;
  cleanUpFunc?: () => void;
  buttonName?: string;
  buttonClass?: string | null;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (closeModal) {
      ref.current?.close();
    }
  }, [closeModal]);

  // prevent modal from closing when pressing esc
  useEffect(() => {
    if (ref.current) {
      ref.current?.addEventListener("cancel", (e) => {
        e.preventDefault();
      });
    }
  }, [ref]);

  return (
    <>
      <button
        className={buttonClass ?? "btn btn-primary btn-sm text-sm"}
        onClick={() => ref.current?.showModal()}
      >
        <p className="px-2">{buttonName ?? "open modal"}</p>
      </button>
      <dialog ref={ref} onCancel={cleanUpFunc} className="modal">
        <div className="modal-box">
          {/* <button
            onClick={() => {
              ref.current?.close();
              cleanUpFunc ? cleanUpFunc() : () => {};
            }}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button> */}

          {children}
        </div>
      </dialog>
    </>
  );
}

export default Modal;

import type { DelConfirmModalProps } from "../../types";
import Button from "./Button";
import Modal from "./Modal";

function DelConfirmModal({ deletePost, closeDeleteModal, deleting }: DelConfirmModalProps) {
  return (
    <Modal
      title="Are you sure you want to delete this item?"
      onClose={closeDeleteModal}
    >
      <div className="flex gap-3 mt-3">
        <Button
          variant="danger"
          onClick={deletePost}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </Modal>
  );
}

export default DelConfirmModal;

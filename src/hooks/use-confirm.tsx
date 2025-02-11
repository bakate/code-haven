import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LuArrowRight, LuUndo } from "react-icons/lu";

type Props = {
  title: string;
  message: string;

}
export const useConfirm = ({ title, message }: Props): { ConfirmationDialog: () => JSX.Element, dialogResponse: () => Promise<unknown> } => {
  const t = useTranslations("createOrEditCourseForm");
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void; } | null>(null);

  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };
  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };


  const ConfirmationDialog = () => (
    <Modal
      isOpen={promise !== null}
      onOpenChange={handleClose}
      placement="top-center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            {title ? <ModalHeader className="flex flex-col gap-1">
              {title}
            </ModalHeader> : null}
            <ModalBody>
              <p className="text-small">
                {message}
              </p>

            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose} startContent={<LuUndo />}>
                {t("cancel")}
              </Button>
              <Button color="danger" variant="flat" onPress={handleConfirm} startContent={<LuArrowRight />}>
                {t("continue")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>

    </Modal>
  )




  return {
    ConfirmationDialog: () => <ConfirmationDialog />,
    dialogResponse: confirm
  }
}

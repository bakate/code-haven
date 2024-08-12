"use client";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { LuArrowBigRight, LuArrowRight, LuBadgeCheck, LuCheckCheck, LuTrash, LuUndo } from "react-icons/lu";

type Props = {
  title?: string;
  children?: React.ReactNode;
  onConfirm?: () => void;

}
export const ConfirmModal = ({ children, onConfirm, title }: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const t = useTranslations("createOrEditCourseForm");
  return (
    <>
      <Button onPress={onOpen} color="danger" startContent={<LuTrash />} variant="flat">
        {t("delete")}

      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
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
                  {children}
                </p>

              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose} startContent={<LuUndo />}>
                  {t("cancel")}
                </Button>
                <Button color="primary" onPress={() => {
                  onConfirm?.();
                  onClose();
                }} startContent={<LuArrowRight />}>
                  {t("continue")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

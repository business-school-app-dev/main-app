import { Heading } from "@/components/ui/heading";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from "@/components/ui/modal";
import { ModalProps } from "react-native";
import { Text } from "@/components/ui/text";

interface GuideCardModalProps {
  isModalVisible: boolean;
  selectedTitle: string;
  selectedContent: string;
  setIsModalVisible: (visible: boolean) => void;
}

export default function GuideCardModal({ isModalVisible, setIsModalVisible, selectedTitle, selectedContent }: GuideCardModalProps) {
  return (
    <Modal isOpen={isModalVisible} onClose={() => setIsModalVisible(false)}>
      <ModalBackdrop />
      <ModalContent className="max-w-[90%] max-h-[80%] rounded-xl">
        <ModalHeader>
          <Heading size="lg">{selectedTitle}</Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody showsVerticalScrollIndicator={false}>
          <Text className="text-base text-gray-700 leading-6 text-left">{selectedContent}</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
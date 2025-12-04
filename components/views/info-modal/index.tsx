import React from 'react';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@/components/ui/modal';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Icon, CloseIcon } from '@/components/ui/icon';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  scrollEnabled?: boolean;
  maxWidth?: string;
  maxHeight?: string;
}

export default function InfoModal({
  isOpen,
  onClose,
  title,
  content,
  size = 'md',
  scrollEnabled = false,
  maxWidth = 'max-w-[90%]',
  maxHeight = 'max-h-[80%]',
}: InfoModalProps) {
  const modalContentClass = `rounded-xl ${maxWidth} ${maxHeight}`.trim();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalBackdrop />
      <ModalContent className={modalContentClass}>
        <ModalHeader>
          <Heading size="lg">{title}</Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody scrollEnabled={scrollEnabled} showsVerticalScrollIndicator={false}>
          <Text className="text-base text-gray-700 leading-6">{content}</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

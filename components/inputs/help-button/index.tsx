import React, { useState } from 'react';
import { Icon, CloseIcon } from '@/components/ui/icon';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@/components/ui/modal';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import IconButton from '@/components/inputs/icon-button';

interface HelpButtonProps {
  title: string;
  content: string;
  variant?: 'primary' | 'secondary' | 'link';
  color?: string;
}

export default function HelpButton({
  title,
  content,
  variant = 'link',
  color = 'white'
}: HelpButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <IconButton
        iconName="help-circle"
        variant={variant}
        color={color}
        onPress={() => setShowModal(true)}
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="md">
        <ModalBackdrop />
        <ModalContent className="rounded-xl">
          <ModalHeader>
            <Heading size="lg">
              {title}
            </Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody scrollEnabled={false}>
            <Text className="text-base text-gray-700 leading-6">
              {content}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

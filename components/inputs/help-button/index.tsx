import React, { useState } from 'react';
import InfoModal from '@/components/views/info-modal';
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

      <InfoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={title}
        content={content}
        size="md"
      />
    </>
  );
}

import { useState } from 'react';

export const useModal = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setOpenModal((prev) => !prev);
  };

  return {
    openModal,
    handleOpenModal,
  };
};

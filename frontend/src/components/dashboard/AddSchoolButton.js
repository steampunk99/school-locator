import React, { useState } from 'react';
import {Button} from '../../components/ui/button';
import AddSchoolModal from './AddSchool';

function AddSchoolButton({ onSchoolAdded }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <React.Fragment>
      <Button onClick={openModal}>Add New School</Button>
      <AddSchoolModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSchoolAdded={onSchoolAdded}
      />
    </React.Fragment>
  );
}

export default AddSchoolButton;
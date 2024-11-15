import React, { useState } from 'react';
import { FaSchool, FaUser, FaGraduationCap } from 'react-icons/fa';
import AddSchoolImagesForm from '../components/AddSchoolImagesForm';

export default function Indexes() {
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);

  const handleImageUploadSuccess = () => {
    console.log('Image upload successful');
  };

  return (
    <div className='bg-background text-foreground'>
      <AddSchoolImagesForm 
        schoolId={selectedSchoolId}
        onSuccess={handleImageUploadSuccess}
      />
    </div>
  );
};


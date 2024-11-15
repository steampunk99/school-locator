import React, { useState } from 'react';
import { FaSchool, FaUser, FaGraduationCap } from 'react-icons/fa';
import AddSchoolImagesForm from '../dashboard/AddSchoolImagesForm';

export default function SuperAdminDashboard() {
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);
  const [handleImageUploadSuccess, setHandleImageUploadSuccess] = useState(null);

  return (
    <div className='bg-background text-foreground'>
     
     <AddSchoolImagesForm 
        schoolId={selectedSchoolId} // Pass the ID of the selected school
        onSuccess={handleImageUploadSuccess}
      />
      
      {/* ... existing dashboard content ... */}
  
    </div>
  );
};


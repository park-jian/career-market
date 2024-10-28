import React from 'react';
import { useParams } from 'react-router-dom';
// import { useResume } from '../../hooks/useResume';
import { getListOne } from '../../api/resume';
import { ResumeInfo } from '../../types/resume';

const Edit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = id ? parseInt(id, 10) : undefined;
  // const { data: resume, isLoading, error } = useResume(numericId);

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;
  // if (!resume) return <div>Resume not found</div>;
  const fields = [
    { name: 'field', label: 'Field', type: 'text' },
    { name: 'level', label: 'Level', type: 'text' },
    { name: 'price', label: 'Price', type: 'number' },
    { name: 'sales_quantity', label: 'Sales Quantity', type: 'number' },
    { name: 'registered_at', label: 'Registered At', type: 'text' },
    { name: 'status', label: 'Status', type: 'text' },
    { name: 'view_count', label: 'View Count', type: 'number' },
  ];
  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* <h1 className="text-2xl font-bold mb-4">{resume.title}</h1>
      {fields.map(field => (
        <div key={field.name} className="mb-4">
          <label className="block mb-2">{field.label}</label>
          <input
            type={field.type}
            name={field.name}
            value={resume[field.name as keyof ResumeInfo] as string}
            readOnly
            className="w-full p-2 border rounded"
          />
        </div> 
      ))}*/}
    </div>
  );
};

export default Edit;
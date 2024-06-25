import React  from 'react';
import styled from 'styled-components';
import { FaUpload } from 'react-icons/fa';

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 2px dashed #4a90e2;
  border-radius: 10px;
  background: linear-gradient(135deg, #e0e7ff, #f5f7fa);
  margin: 20px 0;
`;

const UploadLabel = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #4a90e2;
  color: white;
  border-radius: 5px;
  margin-top: 10px;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #357abd;
  }

  input {
    display: none;
  }
`;

const FileUpload = ({selectedFile,handleChange}) => {
 

  return (
    <UploadContainer>
      <FaUpload size={50} color="#4a90e2" />
      <UploadLabel>
        <input type="file" accept=".txt" onChange={handleChange} />
        Choose File
      </UploadLabel>
      {selectedFile && <p>Selected File: {selectedFile.name}</p>}
    </UploadContainer>
  );
};

export default FileUpload;

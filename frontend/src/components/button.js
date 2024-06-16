import React from 'react';
import styled from 'styled-components';
import { FaCompress, FaExpand } from 'react-icons/fa';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin: 0 10px;
  transition: background-color 0.3s;
  text-decoration: none;
  &:hover {
    background-color: #357abd;
  }

  svg {
    margin-right: 10px;
  }
`;


const ActionButtons = ({ onCompress, onDecompress, downloadUrl }) => {
  const handleDownload = () => {
    if (downloadUrl) {
      window.location.href = downloadUrl; 
    }
  };
  return (
    <ButtonContainer>
     
      <ActionButton onClick={onCompress}>
        <FaCompress />
        Compress
      </ActionButton>
      <ActionButton onClick={onDecompress}>
        <FaExpand />
        Decompress
      </ActionButton>
      {downloadUrl && (
        <>
        <ActionButton onClick={handleDownload}>
          Download File
        </ActionButton>
        <ActionButton onClick={()=>window.location.reload()}>
          Reload to start again
        </ActionButton>
        </>
      )}
    
    </ButtonContainer>
  );
};

export default ActionButtons;

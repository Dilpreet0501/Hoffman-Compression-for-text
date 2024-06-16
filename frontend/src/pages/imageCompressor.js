import React, {useState} from 'react';
import styled from 'styled-components';
import { FaUpload,FaCompress } from 'react-icons/fa';
import axios from 'axios';
import Loader from '../components/loader';
const PageContainer = styled.div`
  text-align: center;
  padding: 20px;
  background: #f0f4f8;
  height: 100vh;
`;

const Header = styled.h1`
  color: #4a90e2;
  margin-bottom: 30px;
`;
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
  }`;
const ImageCompressor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [downloadImgUrl, setDownloadImgUrl] = useState('');
  const [binUrl, setBinUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const compressImage = async () => {
    if (!selectedFile) {
      alert('Please select a file to compress.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsLoading(true);
       await axios.post('http://localhost:3001/img', formData).then ((res)=>{
         const {success,binUrl,downloadImgUrl}= res.data;

      if (success) {
        setBinUrl(`http://localhost:3001${binUrl}`)
        setDownloadImgUrl(`http://localhost:3001${downloadImgUrl}`);
        alert('Compressed Successfully. Kindly click the download button for download');
      } else {
        alert('Compression failed.');
      }
      setIsLoading(false);
    }) 
  };
  return (
    <PageContainer>
      <Loader isLoading={isLoading}/>
      <Header>Image Compressor</Header>
      <UploadContainer>
      <FaUpload size={50} color="#4a90e2" />
      <UploadLabel>
        <input type="file" accept=".bmp" onChange={handleChange} />
        Choose File
      </UploadLabel>
      {selectedFile && <p>Selected File: {selectedFile.name}</p>}
    </UploadContainer>
    <ButtonContainer>
      <ActionButton onClick={compressImage}>
        <FaCompress />
        Compress
      </ActionButton>
     
      {downloadImgUrl && (
        <><ActionButton as='a' href={binUrl} download>
            Download Bin File
          </ActionButton><ActionButton as='a' href={downloadImgUrl} download>
              Download Commpressed Image
            </ActionButton>
            <ActionButton onClick={()=>window.location.reload()}>
          Reload to start again
        </ActionButton></>

      )}
    </ButtonContainer>
    </PageContainer>
  );
};

export default ImageCompressor;

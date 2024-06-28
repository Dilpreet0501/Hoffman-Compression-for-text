import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import FileUpload from '../components/fileupload';
import ActionButtons from '../components/button';
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

const FileCompressor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleCompress = async () => {
    if (!selectedFile) {
      alert('Please select a file to compress.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsLoading(true);
       await axios.post('https://hoffman-compression-for-text-or-img-mxk6.onrender.com/compress', formData).then ((res)=>{
         const {success,downloadUrl}= res.data;

      if (success) {
        setDownloadUrl(`https://hoffman-compression-for-text-or-img-mxk6.onrender.com${downloadUrl}`);
        alert('Compressed Successfully. Kindly click the download button for download');
      } else {
        alert('Compression failed.');
      }
      setIsLoading(false);
    }) 
  };

  const handleDecompress = async () => {
    if (!selectedFile) {
      alert('Please select a file to decompress.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    setIsLoading(true);
    await axios.post('https://hoffman-compression-for-text-or-img-mxk6.onrender.com/decompress', formData).then((res)=>{
      const {success,downloadUrl}= res.data;
    

      if (success) {
        setDownloadUrl(`${downloadUrl}`);
        alert('Decompressed Successfully. Kindly click the download button for download');
      } else {
        alert('Decompression failed.');
      }
      setIsLoading(false);
    } )
  };

  return (
    <PageContainer>
      <Loader isLoading={isLoading}/>
      <Header>File Compressor</Header>
      <FileUpload selectedFile={selectedFile} handleChange={handleFileChange} />
      <ActionButtons onCompress={handleCompress} onDecompress={handleDecompress} downloadUrl={downloadUrl} />
    </PageContainer>
  );
};

export default FileCompressor;


import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaFile, FaImage } from 'react-icons/fa';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background: #f0f4f8;
  height: 100vh;
  justify-content: center;
`;

const Title = styled.h1`
  color: #4a90e2;
  margin-bottom: 30px;
`;

const OptionsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const OptionCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  background: linear-gradient(135deg, #e0e7ff, #f5f7fa);
  padding: 20px;
  border-radius: 10px;
  width: 150px;
  height: 150px;
  color: #4a90e2;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const IconContainer = styled.div`
  margin-bottom: 10px;
`;

const Home = () => {
  return (
    <HomeContainer>
      <Title>What would you like to try?</Title>
      <OptionsContainer>
        <OptionCard to="/file-compressor">
          <IconContainer>
            <FaFile size={50} />
          </IconContainer>
          File Compressor
        </OptionCard>
        <OptionCard to="/image-compressor">
          <IconContainer>
            <FaImage size={50} />
          </IconContainer>
          Image Compressor
        </OptionCard>
      </OptionsContainer>
    </HomeContainer>
  );
};

export default Home;

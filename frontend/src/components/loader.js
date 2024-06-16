import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const LoaderContainer = styled.div`
  display: ${(props) => (props.isLoading ? 'block' : 'none')};
  position: fixed;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #4a90e2;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
`;

const Loader = ({ isLoading }) => {
  return (
    <LoaderContainer isLoading={isLoading}>
      <Spinner />
    </LoaderContainer>
  );
};

export default Loader;

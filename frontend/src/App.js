import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import styled from 'styled-components';
import FileCompressor from './pages/fileCompressor';


const NavBar = styled.nav`
  display: flex;
  justify-content: space-around;
  background-color: #4a90e2;
  padding: 10px;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 18px;
  &:hover {
    text-decoration: underline;
  }
`;

const App = () => {
  return (
    <Router>
      <NavBar>
        
        <NavLink to="/">File Compressor</NavLink>
       
      </NavBar>
      <Routes>
        
        <Route path="/" element={<FileCompressor />} />
       
      </Routes>
    </Router>
  );
};

export default App;

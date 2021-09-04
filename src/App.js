import './App.css';
import Navbar from './components/Navbar';
import React, { useState } from 'react';
import { Container, Box, Button } from '@material-ui/core';
import Dropzone from './components/Dropzone';
import Webcamera from './components/Webcamara';

function App() {
  const [mode, setMode] = useState(false);
  return (
    <Box>
      <Navbar />
      <Container>
        <Box mt={4} textAlign='center'>
          <Button
            variant='contained'
            onClick={() => {
              setMode(!mode);
            }}
            style={{
              width: '40%',
              color: ' #fff',
              background: '#092327',
              padding: 20,
            }}
          >
            เปลี่ยนโหมด
          </Button>
        </Box>
        <Box mt={5}>{mode === true ? <Webcamera /> : <Dropzone />}</Box>
      </Container>
    </Box>
  );
}

export default App;

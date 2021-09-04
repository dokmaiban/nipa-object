import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Box, Grid, Button, Typography } from '@material-ui/core';
import axios from 'axios';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    border: '1px solid #092327',
    padding: 20,
  },
  header: {
    background: '#092327',
    color: '#fff',
    padding: 20,
  },
  button: {
    width: '100%',
    background: '#092327',
    color: '#fff',
    padding: 20,
    marginTop: 20,
  },
}));

export default function Webcamera() {
  const classes = useStyles();
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [box, setBox] = useState();
  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    try {
      const imageBase64 = imageSrc.split('data:image/jpeg;base64,');
      const fetch = await axios.post(
        'https://nvision.nipa.cloud/api/v1/object-detection',
        { raw_data: imageBase64[1] },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'ApiKey cdb29f355cb4059995e054208f8cc73c327e9bbc3a0c290e7d88c58022f3e4f8a6c491cf8411c1b1291068c25c15042aac',
          },
        }
      );
      const data = await fetch.data;
      setBox(data.detected_objects);
    } catch (error) {
      console.log(error);
    }
  }, [webcamRef, setImgSrc]);

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography>แคปรูปภาพ</Typography>
      </Box>
      <Grid container spacing={4} style={{ marginTop: 20 }}>
        <Grid item xs={12} md={6}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat='image/jpeg'
            style={{ width: '100%' }}
          />
          <Button
            variant='contained'
            onClick={capture}
            className={classes.button}
          >
            Capture photo
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box style={{ position: 'relative' }}>
            {box &&
              box.map((item) => {
                const { bounding_box } = item;
                const randomcolor = Math.floor(
                  Math.random() * 16777215
                ).toString(16);
                return (
                  <Box
                    key={item.confidence}
                    style={{
                      height: bounding_box.bottom - bounding_box.top,
                      width: bounding_box.right - bounding_box.left,
                      background: 'transparent',
                      border: `1px solid #${randomcolor}`,
                      position: 'absolute',
                      top: bounding_box.top,
                      bottom: bounding_box.bottom,
                      left: bounding_box.left,
                      right: bounding_box.right,
                    }}
                  >
                    <Box
                      style={{
                        color: '#fff',
                        background: `#${randomcolor}`,
                      }}
                    >
                      name: {item.name} confidence: {item.confidence}
                    </Box>
                  </Box>
                );
              })}
            {imgSrc && (
              <img src={imgSrc} alt='images' style={{ width: '100%' }} />
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

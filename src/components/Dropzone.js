import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';

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

export default function Dropzone() {
  const classes = useStyles();
  const [files, setFiles] = useState([]);
  const [box, setBox] = useState();
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      setBox(null);
    },
  });
  const thumbs = files.map((file) => (
    <div key={file.name}>
      <img src={file.preview} alt='file' className={classes.img} />
    </div>
  ));

  const printFile = () => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      if (files.length > 0) {
        reader.readAsDataURL(files[0]);
        reader.onload = async (e) => {
          const base64URL = reader.result.split(',');
          try {
            const fetch = await axios.post(
              'https://nvision.nipa.cloud/api/v1/object-detection',
              { raw_data: base64URL[1] },
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
        };
        reader.onerror = (error) => {
          reject(error);
        };
      } else {
        alert('กรุณาใส่รูปภาพ');
      }
    });
  };

  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );
  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography>อัพโหลดรูปภาพ</Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={9} md={9}>
          <Box m='auto' mt={3}>
            <Box {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              {files.length === 0 ? (
                <Box textAlign='center'>
                  <ImageOutlinedIcon />
                  <Typography>เลือกรูปภาพ</Typography>
                </Box>
              ) : (
                <Box style={{ position: 'relative' }}>
                  <aside>{thumbs}</aside>
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
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={3} md={3}>
          <Box>
            <Button
              variant='contained'
              className={classes.button}
              onClick={printFile}
            >
              ใช้รูปภาพนี้
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

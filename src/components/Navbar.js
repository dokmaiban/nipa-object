import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Container } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  AppBar: {
    background: '#092327',
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div>
      <AppBar position='static' className={classes.AppBar}>
        <Container>
          <Toolbar>
            <Typography variant='h6' className={classes.title}>
              KAIKY
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

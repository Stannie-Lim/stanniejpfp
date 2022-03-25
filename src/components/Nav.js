import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Badge, IconButton } from '@material-ui/core';

import PersonIcon from '@material-ui/icons/Person';
import SchoolIcon from '@material-ui/icons/School';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
}));

export const Nav = () => {
  const classes = useStyles();
  const [ numCampuses, numStudents ] = useSelector(({ campuses, students }) => [campuses.length, students.length]);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" className={classes.title}>
              <Link to='/' className={classes.link}>
                  Stannie's Campuses and Students App
              </Link>
            </Typography>
          <IconButton color="inherit">
            <Link className={classes.link} to='/students'>
              <Badge badgeContent={numStudents} color="secondary">
                <PersonIcon />
              </Badge>
            </Link>
          </IconButton>
          <IconButton color="inherit">
            <Link className={classes.link} to='/campuses'>
              <Badge badgeContent={numCampuses} color="secondary">
                <SchoolIcon />
              </Badge>
            </Link>
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};
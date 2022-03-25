import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Card, Avatar, Button, CardContent, Typography, CardActions, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  card: {
    maxWidth: '350px',
  },
}));

export const StudentCard = ({ student, campus, setEditModalOpen }) => {
  const classes = useStyles();

  return (
    <>
      <Card variant="outlined" className={classes.card}>
        <CardContent>
          <Grid container spacing={1}>
            <Grid item>
              <Avatar src={student.imageUrl} /> 
            </Grid>
            <Grid item>
              <Typography gutterBottom variant="h5" component="h2">
                {student.fullName}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" component="p">
                {student.email}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" component="p">
                {student.gpa} GPA
              </Typography>
            </Grid>
            {campus && (
              <Grid item>
                <Typography variant="body2">Attends{' '}
                  <Link to={`/campuses/${campus.id}`} style={{ textDecoration: 'none', color: 'dodgerBlue' }}>
                    {campus.name}
                  </Link>
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
        {setEditModalOpen && (
          <CardActions>
            <Button size="small" color="primary" onClick={() => setEditModalOpen(true)} variant="outlined" color="primary">
              Edit
            </Button>
          </CardActions>
        )}
      </Card>
    </>
  );
};
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import { Avatar, DialogActions, DialogContentText, DialogContent, ListItem, ListItemAvatar, ListItemText, DialogTitle, Dialog, Button, Grid } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

import { createStudent, deleteStudent } from '../store';

import { StudentForm } from './forms/StudentForm';

const useStyles = makeStyles({
  avatar: {
    
  },
  link: {
    textDecoration: 'none',
    color: '#4a4a4a',
  },
});

export const Students = () => {
  const classes = useStyles();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(null);
  const [page, setPage] = useState(1);

  const students = useSelector(({ students }) => students);
  const [paginatedStudents, setPaginatedStudents] = useState(students);

  useEffect(() => {
    const paginated = students.slice((page - 1) * 10, page * 10);
    setPaginatedStudents(paginated);
  }, [page, students]);

  const dispatch = useDispatch();
  const submitForm = (inputs) => {
    setCreateModalOpen(false);
    dispatch(createStudent(inputs));
    setPage(1);
  };

  const destroyStudent = () => {
    dispatch(deleteStudent(deleteModalOpen?.id));
    setDeleteModalOpen(null);
  };

  const changePage = (_, value) => {
    setPage(value);
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item container alignItems="center">
          <Grid item xs={12}>
            <ListItem button onClick={() => setCreateModalOpen(true)}>
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Add student" />
            </ListItem>
          </Grid>
        </Grid>
        {paginatedStudents.map((student) => (
          <Grid item container key={student.id} alignItems="center" justifyContent="space-between">
            <Grid item xs={8}>
              <Link to={`/students/${student.id}`} className={classes.link}>
                <ListItem button>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar} src={student.imageUrl} />
                  </ListItemAvatar>
                  <ListItemText primary={student.fullName} />
                </ListItem>
              </Link>
            </Grid>
            <Grid item xs={3}>
              <Button fullWidth color="secondary" variant="outlined" onClick={() => setDeleteModalOpen(student)}>Utterly destroy student</Button>
            </Grid>
          </Grid>
        ))}
        <Grid container item justifyContent="center">
          <Grid item>
            <Pagination count={Math.floor(students.length / 10)} page={page} onChange={changePage} />
          </Grid>
        </Grid>
      </Grid>
      {createModalOpen && (
        <Dialog onClose={() => setCreateModalOpen(false)} open={createModalOpen}>
         <DialogTitle>Create New Student</DialogTitle>
         <DialogContent>
            <DialogContentText>
              Add a new student into our database. Make sure to add a cute profile picture!
            </DialogContentText>
            <StudentForm submitForm={submitForm} setModalOpen={setCreateModalOpen} />
          </DialogContent>
       </Dialog> 
      )}
      {!!deleteModalOpen && (
        <Dialog onClose={() => setDeleteModalOpen(null)} open={!!deleteModalOpen}>
         <DialogTitle>Are you sure you want to utterly destroy {deleteModalOpen?.fullName}?</DialogTitle>
          <DialogActions>
            <Button variant="outlined" onClick={() => setDeleteModalOpen(null)} color="primary">
              Cancel
            </Button>
            <Button variant="outlined" color="primary" onClick={destroyStudent}>
              Utterly destroy
            </Button>
          </DialogActions>
       </Dialog> 
      )}
    </>
  );
};
import { Button, DialogContent, DialogContentText, Dialog, DialogTitle } from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { editStudent } from '../store';

import { StudentCard } from './cards/StudentCard';
import { StudentForm } from './forms/StudentForm';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

export const SingleStudent = ({ match }) => {
  const { id } = match.params;
  const student = useSelector(({ students }) => students.find(student => student.id === +id));
  const campus = useSelector(({ campuses }) => campuses.find(({ id }) => id === student?.campusId));

  const [editModalOpen, setEditModalOpen] = useState(false);

  const dispatch = useDispatch();

  if (!student) return null;

  const submitForm = (values) => {
    dispatch(editStudent(values, id));
    setEditModalOpen(false);
  };

  return (
    <>
      <Link to='/students' style={{ textDecoration: 'none' }}>
        <Button color='primary' variant="text">
          <ChevronLeftIcon />
          Back
        </Button>
      </Link>
      <StudentCard student={student} campus={campus} setEditModalOpen={setEditModalOpen} />
      {editModalOpen && (
        <Dialog onClose={() => setEditModalOpen(null)} open={!!editModalOpen}>
          <DialogTitle>Edit {student.fullName}</DialogTitle>
          <DialogContent>
            <StudentForm student={student} submitForm={submitForm} setModalOpen={setEditModalOpen} isEdit />
          </DialogContent>
        </Dialog>  
      )}
    </>
  );
};
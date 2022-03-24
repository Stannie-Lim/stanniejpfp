import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { TextField, Grid, Button, Avatar, DialogActions } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

export const StudentForm = ({ student, submitForm, isEdit, setModalOpen }) => {
  const campuses = useSelector(({ campuses }) => campuses);

  const [inputs, setInputs] = useState({
    firstName: student?.firstName || '',
    lastName: student?.lastName || '',
    email: student?.email || '',
    imageUrl: student?.imageUrl || '',
    gpa: student?.gpa || 0,
    campusId: student?.campusId,
  });

  const [inputValue, setInputValue] = useState('');

  const onChange = ({ target: { name, value } }) => {
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    submitForm(inputs);
  };

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField required name="firstName" value={inputs.firstName} onChange={onChange} fullWidth label="First name" variant="outlined" />
        </Grid>
        <Grid item xs={6}>
          <TextField required name="lastName" value={inputs.lastName} onChange={onChange} fullWidth label="Last name" variant="outlined" />
        </Grid>
        <Grid item xs={12}>
          <TextField required name="email" value={inputs.email} onChange={onChange} fullWidth label="Email" variant="outlined" />
        </Grid>
        <Grid item xs={12}>
          <TextField name="imageUrl" value={inputs.imageUrl} onChange={onChange} fullWidth label="Image URL" variant="outlined" />
        </Grid>
        <Grid item xs={6}>
          <TextField required name="gpa" value={inputs.gpa} onChange={onChange} fullWidth label="GPA" variant="outlined" type="number" InputProps={{ inputProps: { min: 0, max: 4, step: 0.1, } }} />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            onChange={(_, value) => onChange({ target: { name: 'campusId', value: value?.id } })}
            inputValue={inputValue}
            onInputChange={(_, value) => setInputValue(value)}
            value={campuses.find(({ id }) => id === inputs.campusId)}
            getOptionLabel={({ name }) => name}
            options={campuses}
            renderInput={(params) => <TextField {...params} required label="Campus" fullWidth variant="outlined" />}
          />
        </Grid>
        <Grid item xs={12}>
          {inputs.imageUrl && <Avatar src={inputs.imageUrl} />}
        </Grid>
        <Grid container item xs={12} justifyContent="flex-end">
          <Grid item>
            <DialogActions>
              <Button variant="outlined" onClick={() => setModalOpen(false)} color="primary">
                Cancel
              </Button>
              <Button variant="outlined" type="submit" color="primary">
                {isEdit ? 'Edit' : 'Create'}
              </Button>
            </DialogActions>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};
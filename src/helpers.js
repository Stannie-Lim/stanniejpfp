export const findStudentCampus = (student, campuses) => {
  if (!student || !campuses || !campuses.length) return null;
  const { campusId } = student;
  return campuses.find(({ id }) => id === campusId);
}
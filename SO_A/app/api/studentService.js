// Student API Service — uses centralized apiService
import apiService from '../../services/apiService';

// ─── API Methods ───

export const fetchStudentsFromDB = async () => {
  const result = await apiService.get('/realstudents');
  if (!result.success) throw new Error(result.error || 'Unable to fetch student data.');
  return result.data?.data || [];
};

export const createStudent = async (studentData) => {
  if (!studentData.enrollNumber || !studentData.name) {
    throw new Error('Enrollment number and name are required.');
  }

  const body = mapAppStudentToDBFormat(studentData);
  const result = await apiService.post('/realstudents', body);
  if (!result.success) throw new Error(result.error || 'Unable to create student.');
  return result.data;
};

export const updateStudent = async (id, updatedData) => {
  if (!id) throw new Error('Student ID is required for update.');

  const body = mapAppStudentToDBFormat(updatedData);
  const result = await apiService.put(`/realstudents/${id}`, body);
  if (!result.success) throw new Error(result.error || 'Unable to update student.');
  return result.data;
};

export const deleteStudent = async (id) => {
  if (!id) throw new Error('Student ID is required for deletion.');

  const result = await apiService.del(`/realstudents/${id}`);
  if (!result.success) throw new Error(result.error || 'Unable to delete student.');
  return result.data;
};

// ─── Data mappers ───

const formatDate = (d) => d ? new Date(d).toISOString().split('T')[0] : null;
const todayISO = () => new Date().toISOString().split('T')[0];

const mapAppStudentToDBFormat = (s) => ({
  enrollmentNo: s.enrollNumber,
  studentName: s.name,
  gender: s.gender,
  dateOfBirth: formatDate(s.dateOfBirth),
  religion: s.religion || '',
  address: s.address || '',
  city: s.city || '',
  state: s.country || '',
  pincode: s.pincode || '',
  joiningDate: formatDate(s.joiningDate) || todayISO(),
  motherName: s.motherName || '',
  guardianName: s.fatherName || '',
  guardianType: 'Father',
});

export const mapDBStudentToAppFormat = (db) => ({
  id: db.id,
  enrollNumber: db.enrollmentNo,
  name: db.studentName,
  gender: db.gender,
  religion: db.religion,
  address: db.address,
  city: db.city,
  country: db.state,
  pincode: db.pincode,
  joiningDate: db.joiningDate,
  photo: null,
  documentsaadhar: null,
  documentsbirthcerti: null,
  documentsfamilycard: null,
  fatherName: db.guardianName,
  motherName: db.motherName,
  familyMobile: '',
  familyEmail: '',
  notification: false,
  classDetails: { standard: '', section: '', effFrom: '', effTo: '', teacherName: '' },
  subjectDetails: { classid: '', subjects: '', category: '', status: '', SubjectTeacher: '' },
  medical: { bloodType: '', diseases: '', medicalDetails: null, medicalRemark: '' },
  specialAttentiontype: '',
  specialAttentiondisease: '',
  specialAttentionspecialRemark: '',
  specialAttentionstatus: '',
});

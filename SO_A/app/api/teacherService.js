// Teacher API Service — uses centralized apiService
import apiService from '../../services/apiService';

// ─── API Methods ───

export const fetchTeachersFromDB = async () => {
  const result = await apiService.get('/realteachers');
  if (!result.success) throw new Error(result.error || 'Unable to fetch teachers.');
  return result.data?.data || [];
};

export const fetchTeacherById = async (id) => {
  const result = await apiService.get(`/realteachers/${id}`);
  if (!result.success) throw new Error(result.error || 'Unable to fetch teacher.');
  return result.data;
};

export const createTeacher = async (teacherData) => {
  const body = mapAppTeacherToDBFormat(teacherData);
  const result = await apiService.post('/realteachers', body);
  if (!result.success) throw new Error(result.error || 'Unable to create teacher.');
  return result.data;
};

export const updateTeacher = async (id, teacherData) => {
  const body = mapAppTeacherToDBFormat(teacherData);
  const result = await apiService.put(`/realteachers/${id}`, body);
  if (!result.success) throw new Error(result.error || 'Unable to update teacher.');
  return true;
};

export const deleteTeacher = async (id) => {
  const result = await apiService.del(`/realteachers/${id}`);
  if (!result.success) throw new Error(result.error || 'Unable to delete teacher.');
  return true;
};

export const fetchTeachersByStatus = async (status) => {
  const result = await apiService.get(`/realteachers/by-status/${status}`);
  if (!result.success) throw new Error(result.error || 'Unable to fetch teachers by status.');
  return result.data;
};

export const fetchTeacherHierarchy = async () => {
  const result = await apiService.get('/realteachers/hierarchy');
  if (!result.success) throw new Error(result.error || 'Unable to fetch teacher hierarchy.');
  return result.data;
};

export const searchTeachers = async (searchTerm, page = 1, pageSize = 10) => {
  const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
  if (searchTerm) params.append('search', searchTerm);

  const result = await apiService.get(`/realteachers?${params}`);
  if (!result.success) throw new Error(result.error || 'Unable to search teachers.');
  return result.data;
};

// ─── Data mappers ───

const formatDate = (d) => d ? new Date(d).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

export const mapDBTeacherToAppFormat = (db) => ({
  id: db.id,
  staffCode: db.staffCode,
  firstName: db.firstName,
  lastName: db.lastName,
  fullName: db.fullName,
  fatherOrHusbandName: db.fatherOrHusbandName,
  gender: db.gender,
  dateOfBirth: db.dateOfBirth,
  bloodGroup: db.bloodGroup,
  religion: db.religion,
  category: db.category,
  mobile: db.mobile,
  email: db.email,
  address: db.address,
  city: db.city,
  state: db.state,
  pincode: db.pincode,
  joiningDate: db.joiningDate,
  aadharNo: db.aadharNo,
  pan: db.pan,
  qualification: db.qualification,
  experience: db.experience,
  reportsTo: db.reportsTo,
  status: db.status,
  createdBy: db.createdBy,
  createdOn: db.createdOn,
  auditDate: db.auditDate,
  photo: null,
  documents: [],
  subjects: [],
  classes: [],
});

export const mapAppTeacherToDBFormat = (t) => ({
  staffCode: t.staffCode,
  firstName: t.firstName,
  lastName: t.lastName,
  fatherOrHusbandName: t.fatherOrHusbandName || '',
  gender: t.gender,
  dateOfBirth: formatDate(t.dateOfBirth),
  bloodGroup: t.bloodGroup || '',
  religion: t.religion || '',
  category: t.category || '',
  mobile: t.mobile || '',
  email: t.email || '',
  address: t.address || '',
  city: t.city || '',
  state: t.state || '',
  pincode: t.pincode || '',
  joiningDate: formatDate(t.joiningDate),
  aadharNo: t.aadharNo || '',
  pan: t.pan || '',
  qualification: t.qualification || '',
  experience: t.experience || 0,
  reportsTo: t.reportsTo || null,
});

import { Routes, Route } from 'react-router-dom';
import { ProfessorHome } from './Home';
import { StudentRequests } from './StudentRequests';
import { AttendanceManagement } from './AttendanceManagement';
import { MeetingManagement } from './MeetingManagement';
// import { MiscPosts } from './MiscPosts';

export const ProfessorDashboard = () => {
  return (
    <Routes>
      <Route index element={<ProfessorHome />} />
      <Route path="requests" element={<StudentRequests />} />
      <Route path="attendance" element={<AttendanceManagement />} />
      <Route path="meetings" element={<MeetingManagement />} />
      {/* <Route path="misc" element={<MiscPosts />} /> */}
    </Routes>
  );
};

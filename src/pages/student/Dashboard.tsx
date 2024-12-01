import { Routes, Route } from 'react-router-dom';
import { StudentHome } from './Home';
import { NewRequest } from './NewRequest';
import { RequestStatus } from './RequestStatus';
import { PendingTasks } from './PendingTasks';

export const StudentDashboard = () => {
  return (
    <Routes>
      <Route index element={<StudentHome />} />
      <Route path="new-request" element={<NewRequest />} />
      <Route path="request-status" element={<RequestStatus />} />
      <Route path="pending-tasks" element={<PendingTasks />} />
    </Routes>
  );
};
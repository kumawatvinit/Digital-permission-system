import { useState } from 'react';
import { useAuthStore } from '../store/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { User, Student, Professor, BatchType } from '../types';

export const ProfilePage = () => {
  const user = useAuthStore((state) => state.user) as User;
  const updateUser = useAuthStore((state) => state.updateUser);
  const [email, setEmail] = useState(user.email);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const handleEmailUpdate = () => {
    updateUser({ ...user, email });
    setIsEditingEmail(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <p>{user.name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          {isEditingEmail ? (
            <div className="flex items-center gap-2">
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button onClick={handleEmailUpdate}>Save</Button>
              <Button variant="outline" onClick={() => setIsEditingEmail(false)}>Cancel</Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p>{user.email}</p>
              <Button onClick={() => setIsEditingEmail(true)}>Edit</Button>
            </div>
          )}
        </div>
        {user.role === 'student' && (
          <StudentProfile user={user as Student} />
        )}
        {user.role === 'professor' && (
          <ProfessorProfile user={user as Professor} />
        )}
      </div>
    </div>
  );
};

const StudentProfile = ({ user }: { user: Student }) => {
  return (
    <div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Batch</label>
        <p>{user.batch}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Students in Batch</label>
        <ul>
          {/* Assuming we have a way to fetch students in the same batch */}
          {/* Replace with actual data fetching logic */}
          {['Student 1', 'Student 2', 'Student 3'].map((student) => (
            <li key={student}>{student}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ProfessorProfile = ({ user }: { user: Professor }) => {
  const [selectedBatch, setSelectedBatch] = useState(user.batches[0]);

  return (
    <div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Batches</label>
        <ul>
          {user.batches.map((batch) => (
            <li key={batch}>{batch}</li>
          ))}
        </ul>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Select Batch</label>
        <Select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value as BatchType)}>
          {user.batches.map((batch) => (
            <option key={batch} value={batch}>{batch}</option>
          ))}
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Students in Batch</label>
        <ul>
          {/* Assuming we have a way to fetch students in the selected batch */}
          {/* Replace with actual data fetching logic */}
          {['Student 1', 'Student 2', 'Student 3'].map((student) => (
            <li key={student}>{student}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
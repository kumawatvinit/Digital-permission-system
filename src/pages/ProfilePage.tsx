import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Student, Professor } from '../types';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user) as User;
  const updateUser = useAuthStore((state) => state.updateUser);
  const [email, setEmail] = useState(user.email);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const handleEmailUpdate = async () => {
    try {
      await updateUser({ ...user, email });
      setIsEditingEmail(false);
    } catch (error) {
      alert('Failed to update email');
    }
  };

  const handleBackToDashboard = () => {
    if (user.role === 'student') {
      navigate('/student');
    } else if (user.role === 'professor') {
      navigate('/professor');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={handleBackToDashboard}
      >
        Back to Dashboard
      </Button>
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

const StudentProfile = ({ user }: { user: Student }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">Batch</label>
    <p>{user.batch}</p>
  </div>
);

const ProfessorProfile = ({ user }: { user: Professor }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">Batches</label>
    <p>{user.batches.join(', ')}</p>
  </div>
);
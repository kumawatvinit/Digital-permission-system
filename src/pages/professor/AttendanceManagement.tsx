import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, Plus } from 'lucide-react';
import { format, addHours } from 'date-fns';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useAuthStore } from '../../store/auth';
import { useAttendanceStore } from '../../store/attendance';
import { BatchType, Professor, Attendance } from '../../types';

const NewAttendanceForm = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const user = useAuthStore((state) => state.user) as Professor;
  const addAttendance = useAttendanceStore((state) => state.addAttendance);
  const [batch, setBatch] = useState<BatchType>(user.batches.length > 0 ? user.batches[0] : '');
  const [course, setCourse] = useState('');
  const [duration, setDuration] = useState('60');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!batch) {
      alert('Please select a batch');
      return;
    }

    const now = new Date();
    const attendance: Omit<Attendance, '_id'> = {
      batch,
      course,
      professorId: user._id,
      date: now,
      expiresAt: addHours(now, parseInt(duration) / 60),
      status: 'active',
      students: [],
    };

    try {
      await addAttendance(attendance);
      onClose();
    } catch (error) {
      alert('Failed to create attendance record');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Batch
        </label>
        <Select
          value={batch}
          onChange={(e) => setBatch(e.target.value as BatchType)}
        >
          {user.batches.map((batch) => (
            <option key={batch} value={batch}>
              {batch}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Course Name
        </label>
        <Input
          required
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          placeholder="Enter course name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Duration
        </label>
        <Select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        >
          <option value="60">1 hour</option>
          <option value="90">1.5 hours</option>
          <option value="120">2 hours</option>
        </Select>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Create Attendance</Button>
      </div>
    </form>
  );
};

const AttendanceCard = ({ attendance }: { attendance: Attendance }) => {
  const downloadReport = () => {
    // Create CSV content
    const headers = ['Student ID', 'Status', 'Submission Time'];
    const rows = attendance.students.map((student) => [
      student.studentId,
      student.status,
      student.submittedAt ? format(student.submittedAt, 'MMM d, yyyy HH:mm:ss') : 'N/A',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${attendance.batch}-${format(attendance.date, 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{attendance.course}</h3>
          <p className="text-sm text-gray-500">
            {format(attendance.date, 'MMM d, yyyy h:mm a')}
          </p>
        </div>
        <Button onClick={downloadReport} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>

      <div className="text-sm text-gray-600">
        {attendance.students.length} submissions
      </div>

      <div className="text-sm text-gray-600">
        Status: {attendance.status === 'active' ? 'Active' : 'Not Active'}
      </div>
    </div>
  );
};

export const AttendanceManagement = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user) as Professor;
  const { attendanceRecords, fetchAttendanceRecords } = useAttendanceStore();
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    fetchAttendanceRecords();
  }, [fetchAttendanceRecords]);

  const userAttendance = attendanceRecords
    .filter((record) => record.professorId === user._id)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/professor')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Button onClick={() => setShowNewForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Attendance
        </Button>
      </div>

      {showNewForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Create New Attendance</h2>
          <NewAttendanceForm onClose={() => setShowNewForm(false)} />
        </div>
      )}

      <div className="space-y-4">
        {userAttendance.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No attendance records found
          </div>
        ) : (
          userAttendance.map((attendance) => (
            <AttendanceCard key={attendance._id} attendance={attendance} />
          ))
        )}
      </div>
    </div>
  );
};

export default NewAttendanceForm;
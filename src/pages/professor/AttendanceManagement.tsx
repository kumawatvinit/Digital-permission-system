import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, Plus } from 'lucide-react';
import { format, addHours, differenceInMinutes, isAfter } from 'date-fns';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useAuthStore } from '../../store/auth';
import { useAttendanceStore } from '../../store/attendance';
import { BatchType, Professor, Attendance } from '../../types';
import { BATCH_OPTIONS } from '../../lib/utils';

const NewAttendanceForm = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const user = useAuthStore((state) => state.user);
  console.log('NewAttendanceForm - user:', user);

  if (!user || user.role !== 'professor') {
    console.error('NewAttendanceForm - user is not a professor or does not have batches');
    return null;
  }

  // Manually add batches if missing
  if (!('batches' in user)) {
    (user as Professor).batches = BATCH_OPTIONS;
  }

  const professor = user as Professor;

  const addAttendance = useAttendanceStore((state) => state.addAttendance);
  console.log('NewAttendanceForm - addAttendance:', addAttendance);

  const [batch, setBatch] = useState<BatchType>(professor.batches.length > 0 ? professor.batches[0] : '');
  console.log('NewAttendanceForm - initial batch:', batch);

  const [course, setCourse] = useState('');
  console.log('NewAttendanceForm - initial course:', course);

  const [duration, setDuration] = useState('60');
  console.log('NewAttendanceForm - initial duration:', duration);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('NewAttendanceForm - handleSubmit - batch:', batch);

    if (!batch) {
      alert('Please select a batch');
      return;
    }

    const now = new Date();
    const attendance: Omit<Attendance, '_id'> = {
      batch,
      course,
      professorId: professor._id,
      date: now,
      expiresAt: addHours(now, parseInt(duration) / 60),
      status: 'active',
      students: [],
    };
    console.log('NewAttendanceForm - handleSubmit - attendance:', attendance);

    try {
      await addAttendance(attendance);
      onClose();
    } catch (error) {
      console.error('NewAttendanceForm - handleSubmit - error:', error);
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
          onChange={(e) => {
            setBatch(e.target.value as BatchType);
            console.log('NewAttendanceForm - Select Batch - batch:', e.target.value);
          }}
        >
          {professor.batches.map((batch) => (
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
          onChange={(e) => {
            setCourse(e.target.value);
            console.log('NewAttendanceForm - Course Name - course:', e.target.value);
          }}
          placeholder="Enter course name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Duration
        </label>
        <Select
          value={duration}
          onChange={(e) => {
            setDuration(e.target.value);
            console.log('NewAttendanceForm - Duration - duration:', e.target.value);
          }}
        >
          <option value="60">1 hour</option>
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
    const headers = ['Student ID', 'Student Name', 'Status', 'Submission Time'];
    const rows = attendance.students.map((student) => [
      student.studentId._id,
      student.studentId.name,
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

  const now = new Date();
  const isExpired = isAfter(now, attendance.expiresAt);
  const duration = differenceInMinutes(attendance.expiresAt, attendance.date);

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
        Status: {isExpired ? 'Expired' : 'Active'}
      </div>

      <div className="text-sm text-gray-600">
        Duration: {duration} minutes
      </div>
    </div>
  );
};

export const AttendanceManagement = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  console.log('AttendanceManagement - user:', user);

  if (!user || user.role !== 'professor') {
    console.error('AttendanceManagement - user is not a professor or null');
    return <div>Error: User is not a professor or does not have batches</div>;
  }

  // Manually add batches if missing
  if (!('batches' in user)) {
    (user as Professor).batches = BATCH_OPTIONS;
  }

  const professor = user as Professor;
  console.log('AttendanceManagement - user:', professor);

  const { attendanceRecords, fetchProfessorAttendanceRecords } = useAttendanceStore();
  console.log('AttendanceManagement - attendanceRecords:', attendanceRecords);

  const [showNewForm, setShowNewForm] = useState(false);
  console.log('AttendanceManagement - showNewForm:', showNewForm);

  useEffect(() => {
    fetchProfessorAttendanceRecords();
    console.log('AttendanceManagement - useEffect - fetchProfessorAttendanceRecords called');
  }, [fetchProfessorAttendanceRecords]);

  const userAttendance = attendanceRecords
    .filter((record) => record.professorId === professor._id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  console.log('AttendanceManagement - userAttendance:', userAttendance);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => {
            navigate('/professor');
            console.log('AttendanceManagement - Back to Dashboard clicked');
          }}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Button
          onClick={() => {
            setShowNewForm(true);
            console.log('AttendanceManagement - New Attendance clicked');
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Attendance
        </Button>
      </div>

      {showNewForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Create New Attendance</h2>
          <NewAttendanceForm onClose={() => {
            setShowNewForm(false);
            console.log('AttendanceManagement - NewAttendanceForm onClose called');
          }} />
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

export default AttendanceManagement;
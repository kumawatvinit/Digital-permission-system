import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell } from 'lucide-react';
import { format, isAfter, isBefore, addHours } from 'date-fns';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/auth';
import { useAttendanceStore } from '../../store/attendance';
import { Attendance } from '../../types';

const AttendanceCard = ({ attendance }: { attendance: Attendance }) => {
  const user = useAuthStore((state) => state.user);
  const { submitAttendance } = useAttendanceStore();
  const [submitted, setSubmitted] = useState(false);

  const now = new Date();
  const isLate = isAfter(now, addHours(attendance.date, 1));
  const isExpired = isAfter(now, attendance.expiresAt);

  const handleSubmit = async (status: 'present' | 'late') => {
    try {
      await submitAttendance(attendance._id, { status });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit attendance', error);
      alert('Failed to submit attendance');
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{attendance.course}</h3>
            <p className="text-sm text-gray-500">
              {format(attendance.date, 'MMM d, yyyy h:mm a')}
            </p>
          </div>
          <span className="text-green-600 font-medium">Submitted</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{attendance.course}</h3>
          <p className="text-sm text-gray-500">
            {format(attendance.date, 'MMM d, yyyy h:mm a')}
          </p>
        </div>
        {isExpired ? (
          <span className="text-red-600 font-medium">Expired</span>
        ) : (
          <span className="text-blue-600 font-medium">
            Expires at {format(attendance.expiresAt, 'h:mm a')}
          </span>
        )}
      </div>

      {!isExpired && (
        <div className="flex gap-4">
          {!isLate && (
            <Button
              onClick={() => handleSubmit('present')}
              className="flex-1"
            >
              Mark as Present
            </Button>
          )}
          {isLate && isBefore(now, attendance.expiresAt) && (
            <Button
              onClick={() => handleSubmit('late')}
              variant="outline"
              className="flex-1"
            >
              Mark as Late
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export const PendingTasks = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { attendanceRecords, fetchStudentAttendanceRecords } = useAttendanceStore();
  const [pendingAttendance, setPendingAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    if (user && user.role === 'student') {
      fetchStudentAttendanceRecords((user as any).batch);
    }
  }, [fetchStudentAttendanceRecords, user]);

  useEffect(() => {
    console.log("Fetched attendances: ", attendanceRecords)

    const filteredAttendance = attendanceRecords.filter(
      (a) => a.batch === (user as any).batch
    );
    setPendingAttendance(filteredAttendance);
    console.log('PendingTasks - pendingAttendance:', filteredAttendance);
  }, [attendanceRecords, user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/student')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <h1 className="text-2xl font-bold">Pending Tasks</h1>
      </div>

      <div className="space-y-4">
        {pendingAttendance.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No pending tasks
          </div>
        ) : (
          pendingAttendance.map((attendance) => (
            <AttendanceCard key={attendance._id} attendance={attendance} />
          ))
        )}
      </div>
    </div>
  );
};
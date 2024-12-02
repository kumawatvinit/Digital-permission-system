import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { format, isFuture, parseISO } from 'date-fns';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useAuthStore } from '../../store/auth';
import { useMeetingStore } from '../../store/meetings';
import { BatchType, Professor, Meeting } from '../../types';

const MeetingForm = ({
  onClose,
  initialData,
}: {
  onClose: () => void;
  initialData?: Meeting;
}) => {
  const user = useAuthStore((state) => state.user) as Professor;
  const { addMeeting, updateMeeting } = useMeetingStore();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    date: initialData?.date ? format(new Date(initialData.date), 'yyyy-MM-dd') : '',
    time: initialData?.time || '',
    description: initialData?.description || '',
    batches: initialData?.batches || [] as BatchType[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const meeting = {
      ...formData,
      date: parseISO(formData.date),
      professorId: user._id,
    };

    try {
      if (initialData) {
        await updateMeeting(initialData._id, meeting);
      } else {
        await addMeeting(meeting);
      }
      onClose();
    } catch (error) {
      alert('Failed to save meeting');
    }
  };

  const handleBatchToggle = (batch: BatchType) => {
    setFormData((prev) => ({
      ...prev,
      batches: prev.batches.includes(batch)
        ? prev.batches.filter((b) => b !== batch)
        : [...prev.batches, batch],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Meeting Title
        </label>
        <Input
          required
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Enter meeting title"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <Input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
            min={format(new Date(), 'yyyy-MM-dd')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <Input
            type="time"
            required
            value={formData.time}
            onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          className="w-full h-32 rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Enter meeting description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Batches
        </label>
        <div className="grid grid-cols-3 gap-2">
          {user.batches.map((batch) => (
            <Button
              key={batch}
              type="button"
              variant={formData.batches.includes(batch) ? 'default' : 'outline'}
              onClick={() => handleBatchToggle(batch)}
            >
              {batch}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Meeting' : 'Schedule Meeting'}
        </Button>
      </div>
    </form>
  );
};

const MeetingCard = ({ meeting }: { meeting: Meeting }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { deleteMeeting } = useMeetingStore();
  const isFutureEvent = isFuture(new Date(meeting.date));

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Edit Meeting</h2>
        <MeetingForm
          initialData={meeting}
          onClose={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{meeting.title}</h3>
          <p className="text-sm text-gray-500">
            {format(new Date(meeting.date), 'MMM d, yyyy')} at {meeting.time}
          </p>
        </div>
        {isFutureEvent && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteMeeting(meeting._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {meeting.description && (
        <p className="text-gray-600 mb-4">{meeting.description}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {meeting.batches.map((batch) => (
          <span
            key={batch}
            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
          >
            {batch}
          </span>
        ))}
      </div>
    </div>
  );
};

export const MeetingManagement = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user) as Professor;
  const { meetings, fetchMeetings } = useMeetingStore();
  const [showNewForm, setShowNewForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const filteredMeetings = meetings
    .filter((meeting) => meeting.professorId === user._id)
    .filter((meeting) => {
      if (filter === 'upcoming') return isFuture(new Date(meeting.date));
      if (filter === 'past') return !isFuture(new Date(meeting.date));
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {(['all', 'upcoming', 'past'] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>

          <Button onClick={() => setShowNewForm(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>
      </div>

      {showNewForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Schedule New Meeting</h2>
          <MeetingForm onClose={() => setShowNewForm(false)} />
        </div>
      )}

      <div className="space-y-4">
        {filteredMeetings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No meetings found
          </div>
        ) : (
          filteredMeetings.map((meeting) => (
            <MeetingCard key={meeting._id} meeting={meeting} />
          ))
        )}
      </div>
    </div>
  );
};
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useRequestStore } from '../../store/requests';
import { useAuthStore } from '../../store/auth';
import { Request } from '../../types';

const RequestCard = ({ request }: { request: Request }) => {
  const updateRequest = useRequestStore((state) => state.updateRequest);
  const [remarks, setRemarks] = useState('');
  const [isForwarded, setIsForwarded] = useState(false);

  const handleAction = (status: 'approved' | 'rejected') => {
    updateRequest(request._id, {
      status,
      professorApproval: {
        status,
        remarks,
        date: new Date(),
      },
    });
  };

  const handleForward = () => {
    if (request.professorApproval?.status !== 'approved') {
      return;
    }
    updateRequest(request._id, {
      status: 'forwarded',
    });
    setIsForwarded(true);
  };

  if (isForwarded || request.status === 'forwarded') {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <div className="text-center text-gray-500">
          Request has been forwarded to HOD
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{request.title}</h3>
        <p className="text-sm text-gray-500">
          Submitted on {format(new Date(request.createdAt), 'MMM d, yyyy')}
        </p>
      </div>

      <div className="prose max-w-none mb-6">
        <pre className="whitespace-pre-wrap font-sans text-sm">
          {request.content}
        </pre>
      </div>

      {!request.professorApproval && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks (optional)
            </label>
            <Input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add your remarks here"
            />
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleAction('rejected')}
            >
              Reject
            </Button>
            <Button
              className="flex-1"
              onClick={() => handleAction('approved')}
            >
              Approve
            </Button>
          </div>
        </>
      )}

      {request.professorApproval?.status === 'approved' && (
        <div className="mt-4">
          <Button
            className="w-full"
            onClick={handleForward}
          >
            Forward to HOD
          </Button>
        </div>
      )}
    </div>
  );
};

export const StudentRequests = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { requests = [], fetchProfessorRequests } = useRequestStore();
  const [filter, setFilter] = useState<Request['status'] | 'all'>('all');

  useEffect(() => {
    fetchProfessorRequests();
  }, [fetchProfessorRequests]);

  const filteredRequests = requests
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // .filter((request) => request.professorId === user?._id)
  // .filter((request) => filter === 'all' || request.status === filter)
  // .filter((request) => request.status !== 'forwarded')
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

        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No requests found
          </div>
        ) : (
          filteredRequests.map((request) => (
            <RequestCard key={request._id} request={request} />
          ))
        )}
      </div>
    </div>
  );
};
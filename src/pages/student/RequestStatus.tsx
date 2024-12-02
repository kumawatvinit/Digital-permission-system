import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download } from 'lucide-react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import { Button } from '../../components/ui/Button';
import { useRequestStore } from '../../store/requests';
import { useAuthStore } from '../../store/auth';
import { Request } from '../../types';

const RequestStages = ({ request }: { request: Request }) => {
  const getStageStatus = (stage: number) => {
    if (stage === 1) return 'completed';
    if (stage === 2) {
      if (!request.professorApproval) return 'current';
      return request.professorApproval.status === 'approved' ? 'completed' : 'rejected';
    }
    if (stage === 3) {
      if (!request.professorApproval || request.professorApproval.status === 'rejected') return 'disabled';
      if (!request.hodApproval) return 'current';
      return request.hodApproval.status === 'approved' ? 'completed' : 'rejected';
    }
    return 'disabled';
  };

  const getStageColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'current':
        return 'bg-blue-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStageColor(getStageStatus(1))}`}>
            {getStageStatus(1) === 'completed' ? '✓' : 1}
          </div>
          <span>Submitted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStageColor(getStageStatus(2))}`}>
            {getStageStatus(2) === 'completed' ? '✓' : 2}
          </div>
          <span>Professor Approval</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStageColor(getStageStatus(3))}`}>
            {getStageStatus(3) === 'completed' ? '✓' : 3}
          </div>
          <span>HOD Approval</span>
        </div>
      </div>
    </div>
  );
};

export const RequestStatus = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { requests = [], fetchStudentRequests } = useRequestStore();
  const [filter, setFilter] = useState<Request['status'] | 'all'>('all');

  useEffect(() => {
    fetchStudentRequests();
  }, [fetchStudentRequests]);

  const userRequests = requests
    .filter((request) => request.studentId._id === user?._id)
    .filter((request) => filter === 'all' || request.status === filter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
        {userRequests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No requests found
          </div>
        ) : (
          userRequests.map((request) => (
            <div key={request._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{request.title}</h3>
                  <p className="text-sm text-gray-500">
                    Submitted on {format(new Date(request.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
                {request.hodApproval?.status === 'approved' && (
                  <Button onClick={() => generatePDF(request)} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                )}
              </div>

              <div className="prose max-w-none mb-6">
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {request.content}
                </pre>
              </div>

              <RequestStages request={request} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const generatePDF = (request: Request) => {
  const doc = new jsPDF();
  doc.text(request.title, 10, 10);
  doc.text(request.content, 10, 20);
  doc.save(`${request.title}.pdf`);
};
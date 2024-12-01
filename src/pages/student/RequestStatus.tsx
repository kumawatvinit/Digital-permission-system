import { useState } from 'react';
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

  const stages = [
    { label: 'Submitted', date: request.createdAt },
    {
      label: 'Professor Review',
      date: request.professorApproval?.date,
      remarks: request.professorApproval?.remarks,
    },
    {
      label: 'HOD Review',
      date: request.hodApproval?.date,
      remarks: request.hodApproval?.remarks,
    },
  ];

  return (
    <div className="mt-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-between">
          {stages.map((stage, index) => {
            const status = getStageStatus(index + 1);
            return (
              <div key={stage.label} className="text-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${getStageColor(
                    status
                  )} mx-auto text-white`}
                >
                  {status === 'completed' ? '✓' : index + 1}
                </div>
                <div className="mt-2 text-sm font-medium">{stage.label}</div>
                {stage.date && (
                  <div className="mt-1 text-xs text-gray-500">
                    {format(new Date(stage.date), 'MMM d, yyyy')}
                  </div>
                )}
                {stage.remarks && (
                  <div className="mt-1 text-xs text-gray-600 max-w-[200px] mx-auto">
                    "{stage.remarks}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const RequestCard = ({ request }: { request: Request }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add content to PDF
    doc.setFontSize(16);
    doc.text('Permission Request', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Title: ${request.title}`, 20, 40);
    doc.text(`Date: ${format(new Date(request.createdAt), 'MMM d, yyyy')}`, 20, 50);
    
    const contentLines = doc.splitTextToSize(request.content, 170);
    doc.text(contentLines, 20, 70);
    
    // Add approval details
    let y = 120;
    if (request.professorApproval) {
      doc.text('Professor Approval:', 20, y);
      doc.text(`Status: ${request.professorApproval.status}`, 30, y + 10);
      if (request.professorApproval.remarks) {
        doc.text(`Remarks: ${request.professorApproval.remarks}`, 30, y + 20);
      }
      y += 40;
    }
    
    if (request.hodApproval) {
      doc.text('HOD Approval:', 20, y);
      doc.text(`Status: ${request.hodApproval.status}`, 30, y + 10);
      if (request.hodApproval.remarks) {
        doc.text(`Remarks: ${request.hodApproval.remarks}`, 30, y + 20);
      }
    }
    
    doc.save(`permission-request-${request.id}.pdf`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{request.title}</h3>
          <p className="text-sm text-gray-500">
            Submitted on {format(new Date(request.createdAt), 'MMM d, yyyy')}
          </p>
        </div>
        {request.hodApproval?.status === 'approved' && (
          <Button onClick={generatePDF} variant="outline" size="sm">
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
  );
};

export const RequestStatus = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const requests = useRequestStore((state) => state.requests);
  const [filter, setFilter] = useState<Request['status'] | 'all'>('all');

  const userRequests = requests
    .filter((request) => request.studentId === user?.id)
    .filter((request) => filter === 'all' || request.status === filter)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

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
            <RequestCard key={request.id} request={request} />
          ))
        )}
      </div>
    </div>
  );
};
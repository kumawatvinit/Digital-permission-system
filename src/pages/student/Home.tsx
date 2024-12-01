import { Link } from 'react-router-dom';
import { FileText, Clock, CheckSquare } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const StudentHome = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome Back!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/student/new-request">
          <Button
            variant="outline"
            className="w-full h-32 flex flex-col items-center justify-center gap-2"
          >
            <FileText className="h-8 w-8 text-blue-600" />
            <span>Request New Permission</span>
          </Button>
        </Link>

        <Link to="/student/request-status">
          <Button
            variant="outline"
            className="w-full h-32 flex flex-col items-center justify-center gap-2"
          >
            <Clock className="h-8 w-8 text-blue-600" />
            <span>Your Request Status</span>
          </Button>
        </Link>

        <Link to="/student/pending-tasks">
          <Button
            variant="outline"
            className="w-full h-32 flex flex-col items-center justify-center gap-2"
          >
            <CheckSquare className="h-8 w-8 text-blue-600" />
            <span>Pending Tasks</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
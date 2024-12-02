import { Link } from 'react-router-dom';
import { FileText, Users, Calendar, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ProfessorHome = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Professor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/professor/requests">
          <Button
            variant="outline"
            className="w-full h-32 flex flex-col items-center justify-center gap-2"
          >
            <FileText className="h-8 w-8 text-blue-600" />
            <span>Student Requests</span>
          </Button>
        </Link>

        <Link to="/professor/attendance">
          <Button
            variant="outline"
            className="w-full h-32 flex flex-col items-center justify-center gap-2"
          >
            <Users className="h-8 w-8 text-blue-600" />
            <span>Attendance Management</span>
          </Button>
        </Link>

        <Link to="/professor/meetings">
          <Button
            variant="outline"
            className="w-full h-32 flex flex-col items-center justify-center gap-2"
          >
            <Calendar className="h-8 w-8 text-blue-600" />
            <span>Meeting Management</span>
          </Button>
        </Link>

        {/* <Link to="/professor/misc">
          <Button
            variant="outline"
            className="w-full h-32 flex flex-col items-center justify-center gap-2"
          >
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <span>Miscellaneous Posts</span>
          </Button>
        </Link> */}
      </div>
    </div>
  );
};
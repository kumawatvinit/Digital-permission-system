import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { useRequestStore } from '../../store/requests';
import { useAuthStore } from '../../store/auth';
import { Request } from '../../types';

const REQUEST_TYPES = [
  { id: 'leave', label: 'Apply for Leave' },
  { id: 'deadline-extension', label: 'Apply for Deadline Extension' },
  { id: 'special', label: 'Special Permission' },
  { id: 'custom', label: 'Create New Request' },
] as const;

const TEMPLATES = {
  leave: `Dear Sir/Madam,

I am writing to request leave from [date] to [date] due to [reason].

I will ensure to complete any missed assignments and catch up with the coursework.

Thank you for your consideration.

Yours sincerely,
[Your Name]`,
  'deadline-extension': `Dear Sir/Madam,

I am writing to request an extension for the [assignment/project name] deadline.

Due to [reason], I require additional time to complete the work properly.

Current deadline: [date]
Requested extension: [date]

Thank you for your understanding.

Yours sincerely,
[Your Name]`,
  special: `Dear Sir/Madam,

I am writing to request special permission regarding [matter].

[Explain your situation and requirements]

Thank you for your consideration.

Yours sincerely,
[Your Name]`,
  custom: '',
};

export const NewRequest = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const addRequest = useRequestStore((state) => state.addRequest);
  
  const [type, setType] = useState<keyof typeof TEMPLATES>('leave');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(TEMPLATES.leave);
  const [selectedProfessor, setSelectedProfessor] = useState('');

  // In a real app, this would come from an API
  const professors = [
    { id: 'prof1', name: 'Prof. John Doe' },
    { id: 'prof2', name: 'Prof. Jane Smith' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const request: Request = {
      id: Date.now().toString(),
      title,
      content,
      studentId: user!.id,
      professorId: selectedProfessor,
      status: 'pending',
      type,
      createdAt: new Date(),
    };

    addRequest(request);
    navigate('/student/request-status');
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate('/student')}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">New Permission Request</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Request Type
            </label>
            <Select
              value={type}
              onChange={(e) => {
                const newType = e.target.value as keyof typeof TEMPLATES;
                setType(newType);
                setContent(TEMPLATES[newType]);
              }}
            >
              {REQUEST_TYPES.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of your request"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Application Content
            </label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Professor
            </label>
            <Select
              required
              value={selectedProfessor}
              onChange={(e) => setSelectedProfessor(e.target.value)}
            >
              <option value="">Select a professor</option>
              {professors.map((prof) => (
                <option key={prof.id} value={prof.id}>
                  {prof.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/student')}
            >
              Cancel
            </Button>
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
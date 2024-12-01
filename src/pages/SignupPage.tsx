import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useAuthStore } from '../store/auth';
import { BATCH_OPTIONS } from '../lib/utils';
import { BatchType } from '../types';

export const SignupPage = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [role, setRole] = useState<'student' | 'professor'>('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    batch: BATCH_OPTIONS[0],
    batches: [] as BatchType[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // In a real app, this would make an API call
    setUser({
      id: '1',
      name: formData.name,
      email: formData.email,
      role,
    });
    navigate(role === 'student' ? '/student' : '/professor');
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
    <div className="flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Create your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button
                type="button"
                variant={role === 'student' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setRole('student')}
              >
                Student
              </Button>
              <Button
                type="button"
                variant={role === 'professor' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setRole('professor')}
              >
                Professor
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <Input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
              />
            </div>

            {role === 'student' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Batch
                </label>
                <Select
                  value={formData.batch}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      batch: e.target.value as BatchType,
                    }))
                  }
                >
                  {BATCH_OPTIONS.map((batch) => (
                    <option key={batch} value={batch}>
                      {batch}
                    </option>
                  ))}
                </Select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Batches
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {BATCH_OPTIONS.map((batch) => (
                    <Button
                      key={batch}
                      type="button"
                      variant={
                        formData.batches.includes(batch) ? 'default' : 'outline'
                      }
                      onClick={() => handleBatchToggle(batch)}
                    >
                      {batch}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <Button type="submit" className="w-full">
              Sign up
            </Button>
          </div>

          <div className="text-center text-sm">
            <Link to="/" className="text-blue-600 hover:underline">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
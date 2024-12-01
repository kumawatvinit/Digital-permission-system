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
  const register = useAuthStore((state) => state.register);
  const [role, setRole] = useState<'student' | 'professor'>('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    batch: BATCH_OPTIONS[0],
    batches: [] as BatchType[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
        batch: role === 'student' ? formData.batch : undefined,
        batches: role === 'professor' ? formData.batches : undefined,
      });
      navigate(role === 'student' ? '/student' : '/professor');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign up</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
            {role === 'student' ? (
              <div>
                <label htmlFor="batch" className="sr-only">Batch</label>
                <Select
                  id="batch"
                  name="batch"
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value as BatchType })}
                >
                  {BATCH_OPTIONS.map((batch) => (
                    <option key={batch} value={batch}>{batch}</option>
                  ))}
                </Select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Batches</label>
                <div className="grid grid-cols-2 gap-2">
                  {BATCH_OPTIONS.map((batch) => (
                    <Button
                      key={batch}
                      type="button"
                      variant={formData.batches.includes(batch) ? 'default' : 'outline'}
                      onClick={() => setFormData((prev) => ({
                        ...prev,
                        batches: prev.batches.includes(batch)
                          ? prev.batches.filter((b) => b !== batch)
                          : [...prev.batches, batch],
                      }))}
                    >
                      {batch}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <Button type="submit" className="w-full">Sign up</Button>
          </div>
          <div className="text-sm text-center">
            Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function Register() {
  const [formData, setFormData] = useState({ name: '', username: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
        //check if username already exists in database
      const response = await fetch('/api/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username }),
      });

      const result = await response.json();

      if (result.exists) {
        setError('Username already taken');
        return;
      }

      //register user
      const registerResponse = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (registerResponse.ok) {
        router.push('/dashboard');
      } else {
        setError('Registration failed');
      }
    } catch  {
      setError('An error occurred');
    }
  };

  return (
    <div className="font-[sans-serif] bg-white flex items-center mx-auto md:h-screen p-4">
      <div className="grid md:grid-cols-3 items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-xl overflow-hidden">
        <div className="max-md:order-1 flex flex-col justify-center space-y-16 max-md:mt-16 min-h-full bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 lg:px-8 px-4 py-4">
          <div>
            <h4 className="text-gray-800 text-lg font-semibold">Create New Admin Account</h4>
            <p className="text-[13px] text-gray-800 mt-3 leading-relaxed">Welcome to admin registration page!</p>
          </div>
          <div>
            <h4 className="text-gray-800 text-lg font-semibold">Simple & Easy Registration</h4>
            <p className="text-[13px] text-gray-800 mt-3 leading-relaxed">Our registration process is designed to be straightforward and secure.</p>
          </div>
        </div>

        <form className="md:col-span-2 w-full py-6 px-6 sm:px-16" onSubmit={handleSubmit}>
          <div className="mb-6">
            <h3 className="text-gray-800 text-2xl font-bold">Create an account</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Name</label>
              <div className="relative flex items-center">
                <input name="name" type="text" required className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500" placeholder="Enter name" value={formData.name} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">Username</label>
              <div className="relative flex items-center">
                <input name="username" type="text" required className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500" placeholder="Enter username" value={formData.username} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">Password</label>
              <div className="relative flex items-center">
                <input name="password" type="password" required className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500" placeholder="Enter password" value={formData.password} onChange={handleChange} />
              </div>
            </div>

            
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="!mt-12">
            <button type="submit" className="w-full py-3 px-4 tracking-wider text-sm rounded-md text-white bg-purple-600 hover:bg-purple-800 focus:outline-none">
              Create an account
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}

export default Register;
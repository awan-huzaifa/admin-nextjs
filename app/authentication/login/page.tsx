'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function LoginPage() {
    const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Example credentials check
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  const a =2;
    // if (response.ok) {
    if(a==2)  {
      // if success message 
    //   await response.json();
      // Redirect to the dashboard or home page
      router.push('/dashboard/home');
    } else {
      
      alert('Invalid credentials, please try again.');
    }
  };

  return (
    <div className="font-[sans-serif] min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-lg rounded-md bg-white">
        <div className="md:max-w-md w-full px-4 py-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-12">
              <h3 className="text-gray-800 text-3xl font-extrabold">Sign in</h3>
              <p className="text-sm mt-4 text-gray-800">
                New admin account:
                <Link href="/authentication/register" className="text-purple-600 font-semibold hover:underline ml-1 whitespace-nowrap">
                  Register here
                </Link>
              </p>
            </div>

            <div>
              <label className="text-gray-800 text-xs block mb-2">Username</label>
              <div className="relative flex items-center">
                <input
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-purple-600 px-2 py-3 outline-none"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div className="mt-8">
              <label className="text-gray-800 text-xs block mb-2">Password</label>
              <div className="relative flex items-center">
                <input
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-purple-600 px-2 py-3 outline-none"
                  placeholder="Enter password"
                />
              </div>
            </div>

         

            <div className="mt-12">
              <button type="submit" className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none">
                Sign in
              </button>
            </div>

           
          </form>
        </div>

        <div className="md:h-full bg-[#000842] rounded-xl lg:p-12 p-8">
          <img src="/logo.png" className="w-full h-full object-contain" alt="login-image" />
        </div>
      </div>
    </div>
  );
}
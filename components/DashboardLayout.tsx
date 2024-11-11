import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserGroupIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [selectedSection, setSelectedSection] = useState('Dashboard');
  const router = useRouter();

  const handleNavigation = (section: string) => {
    setSelectedSection(section);
    switch (section) {
      case 'Dashboard':
        router.push('/dashboard/home');
        break;
      case 'PendingRequests':
        router.push('/dashboard/pending-requests');
        break;
      // Add more cases as needed
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <nav className="bg-white shadow-xl h-full fixed top-0 left-0 w-60 py-6 px-4 font-[sans-serif] overflow-auto z-40">
        <div className="relative flex flex-col h-full">
          <div className="flex flex-wrap items-center cursor-pointer relative">
            <img src='/homelogo.png' className="w-10 h-10" />
            <div className="ml-4">
              <p className="text-sm text-[#333] font-semibold">TaskBuddy</p>
              <p className="text-xs text-gray-400 mt-0.5">Admin Portal</p>
            </div>
          </div>

          <hr className="my-6" />

          <div>
            <h4 className="text-sm text-gray-400 mb-4">Menu</h4>
            <ul className="space-y-4 px-2 flex-1">
              <li>
                <button
                  onClick={() => handleNavigation('Dashboard')}
                  className={`w-full text-[#333] text-sm flex items-center hover:text-purple-600 transition-all ${
                    selectedSection === 'Dashboard' ? 'text-purple-600' : ''
                  }`}
                >
                  <ChartBarIcon className="w-4 h-4 mr-4" />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('PendingRequests')}
                  className={`w-full text-[#333] text-sm flex items-center hover:text-purple-600 transition-all ${
                    selectedSection === 'PendingRequests' ? 'text-purple-600' : ''
                  }`}
                >
                  <ClockIcon className="w-4 h-4 mr-4" />
                  <span>Pending Requests</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="mt-auto">
            <div className="flex flex-wrap items-center cursor-pointer border-t py-4">
              <img src='https://readymadeui.com/team-2.webp' className="w-10 h-10 rounded-md border-2 border-white" />
              <div className="ml-4">
                <p className="text-sm text-[#333] font-semibold">Admin User</p>
                <p className="text-xs text-gray-400 mt-0.5">Super Admin</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 ml-60 transition-all duration-300">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 
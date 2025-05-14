import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserGroupIcon, ClockIcon, ChartBarIcon, UsersIcon } from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedSection, setSelectedSection] = useState('Dashboard');

  useEffect(() => {
    // Set the selected section based on the current path
    if (pathname.includes('/dashboard/home')) {
      setSelectedSection('Dashboard');
    } else if (pathname.includes('/dashboard/pending-requests')) {
      setSelectedSection('PendingRequests');
    } else if (pathname.includes('/dashboard/services')) {
      setSelectedSection('ServicesManagement');
    } else if (pathname.includes('/dashboard/categories')) {
      setSelectedSection('CategoriesManagement');
    } else if (pathname.includes('/dashboard/orders')) {
      setSelectedSection('OrdersManagement');
    } else if (pathname.includes('/dashboard/users')) {
      setSelectedSection('UsersManagement');
    } else if (pathname.includes('/dashboard/vendors')) {
      setSelectedSection('VendorsManagement');
    }
  }, [pathname]);

  const handleNavigation = (section: string) => {
    setSelectedSection(section);
    switch (section) {
      case 'Dashboard':
        router.push('/dashboard/home');
        break;
      case 'PendingRequests':
        router.push('/dashboard/pending-requests');
        break;
      case 'ServicesManagement':
        router.push('/dashboard/services');
        break;
      case 'CategoriesManagement':
        router.push('/dashboard/categories');
        break;
      case 'OrdersManagement':
        router.push('/dashboard/orders');
        break;
      case 'UsersManagement':
        router.push('/dashboard/users');
        break;
      case 'VendorsManagement':
        router.push('/dashboard/vendors');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <nav className="bg-white shadow-xl h-screen fixed top-0 left-0 w-60 py-6 px-4 font-[sans-serif] overflow-auto z-40">
        <div className="relative flex flex-col h-full">
          <div className="flex flex-wrap items-center cursor-pointer relative">
            <img src='/homelogo.png' alt="TaskBuddy Logo" className="w-10 h-10" />
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
                  className={`w-full text-[#333] text-sm flex items-center transition-all ${
                    selectedSection === 'Dashboard' ? 'text-purple-600' : 'hover:text-purple-600'
                  }`}
                >
                  <ChartBarIcon className="w-4 h-4 mr-4" />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('PendingRequests')}
                  className={`w-full text-[#333] text-sm flex items-center transition-all ${
                    selectedSection === 'PendingRequests' ? 'text-purple-600 ' : 'hover:text-purple-600'
                  }`}
                >
                  <ClockIcon className="w-4 h-4 mr-4" />
                  <span>Pending Requests</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleNavigation('ServicesManagement')}
                  className={`w-full text-[#333] text-sm flex items-center transition-all ${
                    selectedSection === 'ServicesManagement' ? 'text-purple-600 ' : 'hover:text-purple-600'
                  }`}
                >
                  <ClockIcon className="w-4 h-4 mr-4" />
                  <span>Services Management</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleNavigation('CategoriesManagement')}
                  className={`w-full text-[#333] text-sm flex items-center transition-all ${
                    selectedSection === 'CategoriesManagement' ? 'text-purple-600 ' : 'hover:text-purple-600'
                  }`}
                >
                  <ClockIcon className="w-4 h-4 mr-4" />
                  <span>Categories Management</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleNavigation('OrdersManagement')}
                  className={`w-full text-[#333] text-sm flex items-center transition-all ${
                    selectedSection === 'OrdersManagement' ? 'text-purple-600 ' : 'hover:text-purple-600'
                  }`}
                >
                  <ClockIcon className="w-4 h-4 mr-4" />
                  <span>Orders Management</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleNavigation('UsersManagement')}
                  className={`w-full text-[#333] text-sm flex items-center transition-all ${
                    selectedSection === 'UsersManagement' ? 'text-purple-600 ' : 'hover:text-purple-600'
                  }`}
                >
                  <UserGroupIcon className="w-4 h-4 mr-4" />
                  <span>Users Management</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleNavigation('VendorsManagement')}
                  className={`w-full text-[#333] text-sm flex items-center transition-all ${
                    selectedSection === 'VendorsManagement' ? 'text-purple-600 ' : 'hover:text-purple-600'
                  }`}
                >
                  <UsersIcon className="w-4 h-4 mr-4" />
                  <span>Vendors Management</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="mt-auto">
            <div className="flex flex-wrap items-center cursor-pointer border-t py-4">
              <img src='https://readymadeui.com/team-2.webp' alt="Admin User" className="w-10 h-10 rounded-md border-2 border-white" />
              <div className="ml-4">
                <p className="text-sm text-[#333] font-semibold">Admin User</p>
                <p className="text-xs text-gray-400 mt-0.5">Super Admin</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 ml-60 min-h-screen">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 
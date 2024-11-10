'use client';

import { useState } from 'react';
import PendingRequestSection from '@/components/PendingRequest';


export default function Dashboard() {
  const [selectedSection, setSelectedSection] = useState('Dashboard');

  const renderSection = () => {
    switch (selectedSection) {
    //   case 'Dashboard':
    //     return <DashboardSection />;
      case 'PendingRequests':
        return <PendingRequestSection />;
    //   case 'Inbox':
    //     return <InboxSection />;
    //   default:
    //     return <DashboardSection />;
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
            <h4 className="text-sm text-gray-400 mb-4">Insights</h4>
            <ul className="space-y-4 px-2 flex-1">
              <li>
                <a
                  href="#"
                  onClick={() => setSelectedSection('Dashboard')}
                  className={`text-[#333] text-sm flex items-center hover:text-purple-600 transition-all ${selectedSection === 'Dashboard' ? 'text-purple-600' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4 mr-4" viewBox="0 0 512 512">
                    <path d="M197.332 170.668h-160C16.746 170.668 0 153.922 0 133.332v-96C0 16.746 16.746 0 37.332 0h160c20.59 0 37.336 16.746 37.336 37.332v96c0 20.59-16.746 37.336-37.336 37.336zM37.332 32A5.336 5.336 0 0 0 32 37.332v96a5.337 5.337 0 0 0 5.332 5.336h160a5.338 5.338 0 0 0 5.336-5.336v-96A5.337 5.337 0 0 0 197.332 32zm160 480h-160C16.746 512 0 495.254 0 474.668v-224c0-20.59 16.746-37.336 37.332-37.336h160c20.59 0 37.336 16.746 37.336 37.336v224c0 20.586-16.746 37.332-37.336 37.332zm-160-266.668A5.337 5.337 0 0 0 32 250.668v224A5.336 5.336 0 0 0 37.332 480h160a5.337 5.337 0 0 0 5.336-5.332v-224a5.338 5.338 0 0 0-5.336-5.336zM474.668 512h-160c-20.59 0-37.336-16.746-37.336-37.332v-96c0-20.59 16.746-37.336 37.336-37.336h160c20.586 0 37.332 16.746 37.332 37.336v96C512 495.254 495.254 512 474.668 512zm-160-138.668a5.338 5.338 0 0 0-5.336 5.336v96a5.337 5.337 0 0 0 5.336 5.332h160a5.336 5.336 0 0 0 5.332-5.332v-96a5.337 5.337 0 0 0-5.332-5.336zm160-74.664h-160c-20.59 0-37.336-16.746-37.336-37.336v-224C277.332 16.746 294.078 0 314.668 0h160C495.254 0 512 16.746 512 37.332v224c0 20.59-16.746 37.336-37.332 37.336zM314.668 32a5.337 5.337 0 0 0-5.336 5.332v224a5.338 5.338 0 0 0 5.336 5.336h160a5.337 5.337 0 0 0 5.332-5.336v-224A5.336 5.336 0 0 0 474.668 32zm0 0" data-original="#000000" />
                  </svg>
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => setSelectedSection('PendingRequests')}
                  className={`text-[#333] text-sm flex items-center hover:text-purple-600 transition-all ${selectedSection === 'PendingRequests' ? 'text-purple-600' : ''}`}
                >
                  <span>Pending Requests</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => setSelectedSection('Inbox')}
                  className={`text-[#333] text-sm flex items-center hover:text-purple-600 transition-all ${selectedSection === 'Inbox' ? 'text-purple-600' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke='currentColor' className="w-4 h-4 mr-4" viewBox="0 0 682.667 682.667">
                    <defs>
                      <clipPath id="a" clipPathUnits="userSpaceOnUse">
                        <path d="M0 512h512V0H0Z" data-original="#000000" />
                      </clipPath>
                    </defs>
                    <g clipPath="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                      <path fill="none" strokeMiterlimit="10" strokeWidth="40" d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z" data-original="#000000" />
                      <path d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z" data-original="#000000" />
                    </g>
                  </svg>
                  <span>Inbox</span>
                </a>
              </li>
            </ul>
          </div>

          <hr className="my-6" />

          <div className="flex-1">
            <h4 className="text-sm text-gray-400 mb-4">Shared</h4>
            <ul className="space-y-4 px-2 flex-1">
              <li>
                <a
                  href="#"
                  onClick={() => setSelectedSection('PendingRequests')}
                  className={`text-[#333] text-sm flex items-center hover:text-purple-600 transition-all ${selectedSection === 'PendingRequests' ? 'text-purple-600' : ''}`}
                >
                  <span>Pending Requests</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => setSelectedSection('Inbox')}
                  className={`text-[#333] text-sm flex items-center hover:text-purple-600 transition-all ${selectedSection === 'Inbox' ? 'text-purple-600' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke='currentColor' className="w-4 h-4 mr-4" viewBox="0 0 682.667 682.667">
                    <defs>
                      <clipPath id="a" clipPathUnits="userSpaceOnUse">
                        <path d="M0 512h512V0H0Z" data-original="#000000" />
                      </clipPath>
                    </defs>
                    <g clipPath="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                      <path fill="none" strokeMiterlimit="10" strokeWidth="40" d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z" data-original="#000000" />
                      <path d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z" data-original="#000000" />
                    </g>
                  </svg>
                  <span>Inbox</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="mt-4">
            <ul className="space-y-4 px-2">
              <li>
                <a
                  href="#"
                  onClick={() => setSelectedSection('Settings')}
                  className={`text-[#333] text-sm flex items-center hover:text-purple-600 transition-all ${selectedSection === 'Settings' ? 'text-purple-600' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" l="currentColor" className="w-4 h-4 mr-4" viewBox="0 0 24 24">
                    <path d="M13.12 24h-2.24a1.498 1.498 0 0 1-1.486-1.32l-.239-1.876a9.45 9.45 0 0 1-1.374-.569l-1.494 1.161a1.492 1.492 0 0 1-1.985-.126l-1.575-1.575a1.488 1.488 0 0 1-.122-1.979l1.161-1.495a9.232 9.232 0 0 1-.569-1.374l-1.88-.239A1.501 1.501 0 0 1 0 13.12v-2.24c0-.757.567-1.396 1.32-1.486l1.876-.239a9.45 9.45 0 0 1 .569-1.374l-1.16-1.494a1.49 1.49 0 0 1 .127-1.986l1.575-1.575a1.489 1.489 0 0 1 1.979-.122L7.78 3.766a9.416 9.416 0 0 1 1.375-.569l.239-1.88C9.484.567 10.123 0 10.88 0h2.24c.757 0 1.396.567 1.486 1.32l.239 1.876c.478.155.938.346 1.375.569l1.494-1.161a1.49 1.49 0 0 1 1.985.127l1.575 1.575c.537.521.591 1.374.122 1.979L20.235 7.78c.224.437.415.897.569 1.374l1.88.239A1.5 1.5 0 0 1 24 10.88v2.24c0 .757-.567 1.396-1.32 1.486l-1.876.239a9.45 9.45 0 0 1-.569 1.374l1.161 1.494a1.49 1.49 0 0 1-.127 1.985l-1.575 1.575a1.487 1.487 0 0 1-1.979.122l-1.495-1.161a9.232 9.232 0 0 1-1.374.569l-.239 1.88A1.5 1.5 0 0 1 13.12 24zm-5.39-4.86c.083 0 .168.021.244.063a8.393 8.393 0 0 0 1.774.736.5.5 0 0 1 .358.417l.28 2.2c.03.251.247.444.494.444h2.24a.504.504 0 0 0 .493-.439l.281-2.204a.5.5 0 0 1 .358-.417 8.393 8.393 0 0 0 1.774-.736.499.499 0 0 1 .55.042l1.75 1.36a.492.492 0 0 0 .655-.034l1.585-1.585a.495.495 0 0 0 .039-.66l-1.36-1.75a.5.5 0 0 1-.042-.55 8.393 8.393 0 0 0 .736-1.774.5.5 0 0 1 .417-.358l2.2-.28A.507.507 0 0 0 23 13.12v-2.24a.504.504 0 0 0-.439-.493l-2.204-.281a.5.5 0 0 1-.417-.358 8.393 8.393 0 0 0-.736-1.774.497.497 0 0 1 .042-.55l1.36-1.75a.49.49 0 0 0-.033-.654l-1.585-1.585a.492.492 0 0 0-.66-.039l-1.75 1.36a.5.5 0 0 1-.551.042 8.359 8.359 0 0 0-1.774-.736.5.5 0 0 1-.358-.417l-.28-2.2A.507.507 0 0 0 13.12 1h-2.24a.504.504 0 0 0-.493.439l-.281 2.204a.502.502 0 0 1-.358.418 8.356 8.356 0 0 0-1.774.735.5.5 0 0 1-.551-.041l-1.75-1.36a.49.49 0 0 0-.654.033L3.434 5.014a.495.495 0 0 0-.039.66l1.36 1.75a.5.5 0 0 1 .042.55 8.341 8.341 0 0 0-.736 1.774.5.5 0 0 1-.417.358l-2.2.28A.505.505 0 0 0 1 10.88v2.24c0 .247.193.464.439.493l2.204.281a.5.5 0 0 1 .417.358c.18.626.428 1.223.736 1.774a.497.497 0 0 1-.042.55l-1.36 1.75a.49.49 0 0 0 .033.654l1.585 1.585a.494.494 0 0 0 .66.039l1.75-1.36a.515.515 0 0 1 .308-.104z" data-original="#000000" />
                    <path d="M12 17c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5zm0-9c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4z" data-original="#000000" />
                  </svg>
                  <span>Settings</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => setSelectedSection('Profile')}
                  className={`text-[#333] text-sm flex items-center hover:text-purple-600 transition-all ${selectedSection === 'Profile' ? 'text-purple-600' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4 mr-4" viewBox="0 0 512 512">
                    <path d="M437.02 74.98C388.668 26.63 324.379 0 256 0S123.332 26.629 74.98 74.98C26.63 123.332 0 187.621 0 256s26.629 132.668 74.98 181.02C123.332 485.37 187.621 512 256 512s132.668-26.629 181.02-74.98C485.37 388.668 512 324.379 512 256s-26.629-132.668-74.98-181.02zM111.105 429.297c8.454-72.735 70.989-128.89 144.895-128.89 38.96 0 75.598 15.179 103.156 42.734 23.281 23.285 37.965 53.687 41.742 86.152C361.641 462.172 311.094 482 256 482s-105.637-19.824-144.895-52.703zM256 269.507c-42.871 0-77.754-34.882-77.754-77.753C178.246 148.879 213.13 114 256 114s77.754 34.879 77.754 77.754c0 42.871-34.883 77.754-77.754 77.754zm170.719 134.427a175.9 175.9 0 0 0-46.352-82.004c-18.437-18.438-40.25-32.27-64.039-40.938 28.598-19.394 47.426-52.16 47.426-89.238C363.754 132.34 315.414 84 256 84s-107.754 48.34-107.754 107.754c0 37.098 18.844 69.875 47.465 89.266-21.887 7.976-42.14 20.308-59.566 36.542-25.235 23.5-42.758 53.465-50.883 86.348C50.852 364.242 30 312.512 30 256 30 131.383 131.383 30 256 30s226 101.383 226 226c0 56.523-20.86 108.266-55.281 147.934zm0 0" data-original="#000000" />
                  </svg>
                  <span>Profile</span>
                </a>
              </li>
            </ul>

            <div className="flex flex-wrap items-center cursor-pointer border-t py-2 mt-6">
              <img src='https://readymadeui.com/team-2.webp' className="w-10 h-10 rounded-md border-2 border-white" />
              <div className="ml-4">
                <p className="text-sm text-[#333] font-semibold">John Doe</p>
                <p className="text-xs text-gray-400 mt-0.5">Active free account</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 ml-60 transition-all duration-300">
        <main className="p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
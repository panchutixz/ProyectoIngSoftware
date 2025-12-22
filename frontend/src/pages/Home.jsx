import { useState } from 'react';

import Sidebar from '../components/Sidebar.jsx';

const Home = () => {
  const [profileData] = useState(null);
  
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar a la izquierda (visible en md+) */}
        <aside className="hidden md:block col-span-1">
          <Sidebar />
        </aside>

        {/* Contenido principal */}
        <main className="col-span-1 md:col-span-3 flex items-center justify-center">
          <div className="w-full max-w-2xl p-6">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 drop-shadow-lg py-3 rounded-md">
              Bienvenido a Bicicletero UBB
            </h1>

            {}
            {profileData && profileData.data && profileData.data.userData && (
              <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex flex-col gap-2">
                  <div>
                    <div className="text-lg font-semibold text-gray-800">{profileData.data.userData.email}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;

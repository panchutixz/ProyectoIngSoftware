import { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import bicicleteroLogo from '../assets/bicicletas.png';

const Home = () => {
  const [profileData] = useState(null);

  return (
    <div
      className="h-screen overflow-hidden bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bicicleteroLogo})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative flex items-center justify-center h-full px-4">
        <div className="w-full max-w-4xl bg-white/75 backdrop-blur-md rounded-2xl shadow-xl px-10 py-12 text-center">
          
          <h1
            className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg"
            style={{ color: '#0a98c3' }}
          >
            Bienvenido a Bicicletero UBB
          </h1>

          <p className="text-lg md:text-xl text-gray-700 font-medium mb-6">
            Comprometidos con la seguridad, el control y el resguardo de tu bicicleta
            dentro del campus universitario.
          </p>

          <p className="flex items-center justify-center gap-3 text-gray-600 font-semibold">
            🔒 Seguridad &nbsp;•&nbsp; 📋 Registro &nbsp;•&nbsp; 🚲 Confianza
          </p>

          {profileData?.data?.userData && (
            <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="text-lg font-semibold text-gray-800">
                {profileData.data.userData.email}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 p-4">
        <aside className="hidden md:block col-span-1">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
};

export default Home;

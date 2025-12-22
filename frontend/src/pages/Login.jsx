import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth.service';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/logo.svg';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(null);
    const { setUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const res = await login({ email, password });
        // login() guarda el usuario en sessionStorage; actualizar contexto si existe
        const stored = sessionStorage.getItem('usuario');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch (e) {
                console.error('Error parsing stored user', e);
            }
            navigate('/home');
        } else {
            setError(res.message || 'Credenciales incorrectas');
        }
    };

    return (
        <div className="min-h-screen bg-[#066380] flex items-center justify-center p-6">
            <div className="bg-white rounded-[40px] shadow-lg p-10 w-full max-w-md">
                <img src={logo} alt="logo" className="w-40 mx-auto mb-4" />

                <h1 className="text-center text-2xl font-semibold text-gray-800 mb-6 uppercase">
                    Iniciar sesión
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Email:</label>
                        <input
                            id="email"
                            type="email"
                            className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-200"
                            placeholder="usuario@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mt-4">Contraseña:</label>
                        <input
                            id="password"
                            type="password"
                            className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-200"
                            placeholder="**********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className="mx-auto block bg-[#066380] hover:bg-[#05586f] text-white font-semibold px-12 py-3 rounded-full text-lg">
                        Iniciar sesión
                    </button>
                </form>
                {error && (
                    <p className="mt-4 text-center text-red-600 font-semibold">{error}</p>
                )}
                {/* Botón para ir al registro */}
                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={() => navigate('/auth/register')}
                        className="text-teal-800 font-medium uppercase"
                    >
                        ¿No tienes cuenta? Regístrate
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;

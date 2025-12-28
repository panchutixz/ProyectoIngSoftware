import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import '@styles/styles.css';
import Register from '@pages/Register';
import Profile from '@pages/Profile'
import Usuarios from '@pages/Usuarios';
import Bicicletas from '@pages/Bicicletas';
import Bicicleteros from '@pages/Bicicleteros';
import ConsultarBicicleteros from '@pages/ConsultarBicicleteros';
//import RegistrarBicicletas from '@pages/RegistrarBicicletas';
import Reclamos from '@pages/Reclamos'; 
import AsignarGuardias from '@pages/AsignarGuardias';
import Historial from '@pages/Historial';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: '/',
        element: <Login />
      },
      {
        path: '/auth',
        element: <Login />
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: '/auth/register',
        element: <Register />
      },
      {
        path: "/usuarios",
        element: (
          <ProtectedRoute allowedRoles={["admin", "guardia"]}>
            <Usuarios />
          </ProtectedRoute>
        ),
      },
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/bicicletas',
        element: <ProtectedRoute allowedRoles={["admin", "guardia"]}
        ><Bicicletas />
        </ProtectedRoute>
      },
      {
        path: '/bicicleteros',
        element: <ProtectedRoute allowedRoles={["admin", "guardia"]}
        ><Bicicleteros/>
        </ProtectedRoute>
      },
      {
        path: '/consultarBicicleteros',
        element: <ProtectedRoute allowedRoles={["admin", "guardia"]}
        ><ConsultarBicicleteros/>
        </ProtectedRoute>
      },
      {
        path: '/Misreclamos',
        element: <ProtectedRoute allowedRoles={["estudiante", "academico", "funcionario"]}
        ><Reclamos />
        </ProtectedRoute>
      },
      {
        path: '/asignarGuardias',
        element: <ProtectedRoute allowedRoles={["admin", "guardia"]}
        ><AsignarGuardias/>
        </ProtectedRoute>
      },
      {
      path: '/historial',
        element: (
          <ProtectedRoute>
            <Historial />
          </ProtectedRoute>
        ),
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);

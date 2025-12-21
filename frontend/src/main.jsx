import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import '@styles/styles.css';
import Register from '@pages/Register';
import Profile from '@pages/Profile';
import Usuarios from '@pages/Usuarios';
import Bicicletas from '@pages/Bicicletas';
import Bicicleteros from '@pages/Bicicleteros';
import AsignarGuardias from '@pages/AsignarGuardias';

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
        path: '/asignarGuardias',
        element: <ProtectedRoute allowedRoles={["admin", "guardia"]}
        ><AsignarGuardias/>
        </ProtectedRoute>
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);

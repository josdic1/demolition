import { App } from './App.jsx';
import { ErrorPage } from './pages/ErrorPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { SongCard } from './pages/SongCard.jsx';
import { SongForm } from './components/SongForm.jsx';

export const routes = [
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                
                index: true,
                element: 
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>,
            }, {
                path: 'login',
                element: <LoginPage />,
            }, {
                path: 'songs/:id',
                element: 
                    <ProtectedRoute>
                        <SongCard />
                    </ProtectedRoute>,
            }, {
                path: 'songs',
                element: 
                    <ProtectedRoute>
                        <SongForm />
                    </ProtectedRoute>,
            },, {
                path: 'songs/:id/edit',
                element: 
                    <ProtectedRoute>
                        <SongForm />
                    </ProtectedRoute>,
            }
        ],
    },
];

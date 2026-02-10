import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

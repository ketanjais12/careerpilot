import { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import CreateApplication from './pages/CreateApplication';
import EditApplication from './pages/EditApplication';
import InterviewSession from './pages/InterviewSession';
import { AlertCircle, User, Mail, Lock } from 'lucide-react';

const AuthPage = () => {
  const { user, login, register } = useContext(AuthContext);
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) return <Navigate to="/dashboard" replace />; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!name) {
          setError('Name is required for registration');
          return;
        }
        await register(name, email, password);
      }
    } catch (err) {
  console.error('AUTH ERROR:', err);
  console.error('RESPONSE:', err.response);
  console.error('DATA:', err.response?.data);

  setError(
    err.response?.data?.message ||
    err.message ||
    'Authentication failed. Please try again.'
  );
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 relative overflow-hidden selection:bg-lime-400/30">
      
      {/* Ambient Background */}
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-lime-400/[0.035] blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-emerald-500/[0.025] blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 bg-[#0b0b0b] p-8 md:p-10 rounded-3xl shadow-2xl border border-zinc-800/80 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-3xl font-bold text-white text-center mb-2 tracking-tight">CareerPilot</h1>
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-center text-zinc-500 mb-8">
          {isLogin ? 'Log in to your account' : 'Create an account'}
        </h2>
        
        {/* Error State */}
        {error && (
          <div className="bg-rose-500/10 text-rose-400 p-4 rounded-xl mb-6 text-sm border border-rose-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <User className="w-4 h-4 text-zinc-500 group-focus-within:text-lime-400 transition-colors" />
              </div>
              <input 
                className="w-full bg-zinc-900/50 border border-zinc-800/80 rounded-xl py-3.5 pl-11 pr-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-lime-400/50 focus:bg-zinc-900 focus:ring-1 focus:ring-lime-400/50 transition-all" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Full Name" 
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Mail className="w-4 h-4 text-zinc-500 group-focus-within:text-lime-400 transition-colors" />
            </div>
            <input 
              className="w-full bg-zinc-900/50 border border-zinc-800/80 rounded-xl py-3.5 pl-11 pr-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-lime-400/50 focus:bg-zinc-900 focus:ring-1 focus:ring-lime-400/50 transition-all" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Email Address" 
              required
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Lock className="w-4 h-4 text-zinc-500 group-focus-within:text-lime-400 transition-colors" />
            </div>
            <input 
              className="w-full bg-zinc-900/50 border border-zinc-800/80 rounded-xl py-3.5 pl-11 pr-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-lime-400/50 focus:bg-zinc-900 focus:ring-1 focus:ring-lime-400/50 transition-all" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password (min 6 characters)" 
              required
              minLength="6"
            />
          </div>
          
          <button type="submit" className="mt-2 w-full bg-lime-400 text-black font-semibold px-4 py-3.5 rounded-xl shadow-[0_0_30px_rgba(163,230,53,0.12)] hover:bg-lime-300 hover:shadow-[0_0_35px_rgba(163,230,53,0.2)] active:scale-[0.98] transition-all duration-200">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <p className="mt-8 text-center text-sm text-zinc-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }} 
            className="text-lime-400 font-medium hover:text-lime-300 underline underline-offset-4 transition-colors"
          >
            {isLogin ? 'Sign up here' : 'Log in here'}
          </button>
        </p>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/interview/:id" element={<InterviewSession />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route 
            path="/applications/:id" 
            element={
              <ProtectedRoute>
                <EditApplication />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/applications/new" 
            element={
              <ProtectedRoute>
                <CreateApplication />
              </ProtectedRoute>
            } 
          />
          
        
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
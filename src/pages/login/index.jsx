import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import SecurityBadges from './components/SecurityBadges';
import DemoCredentials from './components/DemoCredentials';

const LoginPage = () => {
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('cashflow_user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        // Check if session is still valid (in real app, verify JWT)
        if (userData?.email) {
          navigate('/overview-dashboard');
        }
      } catch (error) {
        // Clear invalid session data
        localStorage.removeItem('cashflow_user');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-pronounced p-8 backdrop-blur-sm">
          {/* Header */}
          <LoginHeader />

          {/* Login Form */}
          <LoginForm />

          {/* Demo Credentials */}
          <DemoCredentials />

          {/* Security Badges */}
          <SecurityBadges />
        </div>

        {/* PWA Offline Indicator */}
        <div className="absolute -bottom-12 left-0 right-0 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-card/80 backdrop-blur-sm border border-border rounded-full">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Sistema disponível offline</span>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-muted-foreground">
          CashFlow Pro v2.1.0 • © {new Date()?.getFullYear()} • Desenvolvido para empresas brasileiras
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
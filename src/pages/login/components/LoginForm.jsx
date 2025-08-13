import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock credentials for authentication
  const mockCredentials = [
    {
      email: 'admin@techsolutions.com.br',
      password: 'Admin123!',
      role: 'admin',
      company: 'Tech Solutions Ltda'
    },
    {
      email: 'maria.santos@consultoria.com.br',
      password: 'Maria2024@',
      role: 'admin',
      company: 'Consultoria Digital ME'
    },
    {
      email: 'viewer@inovacao.com.br',
      password: 'Viewer123#',
      role: 'viewer',
      company: 'Inovação Empresarial SA'
    }
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear errors when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email?.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(formData?.email)) {
      newErrors.email = 'Formato de e-mail inválido';
    }

    if (!formData?.password?.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check credentials
      const user = mockCredentials?.find(
        cred => cred?.email === formData?.email && cred?.password === formData?.password
      );

      if (user) {
        // Store user session (in real app, this would be JWT tokens)
        localStorage.setItem('cashflow_user', JSON.stringify({
          email: user?.email,
          role: user?.role,
          company: user?.company,
          loginTime: new Date()?.toISOString(),
          rememberMe: formData?.rememberMe
        }));

        // Redirect to dashboard
        navigate('/overview-dashboard');
      } else {
        setErrors({
          general: 'E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.'
        });
      }
    } catch (error) {
      setErrors({
        general: 'Erro no servidor. Tente novamente em alguns instantes.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // In real app, this would navigate to password recovery
    alert('Funcionalidade de recuperação de senha será implementada em breve.');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error Message */}
        {errors?.general && (
          <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} color="var(--color-error)" />
              <span className="text-sm text-error">{errors?.general}</span>
            </div>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <Input
            label="E-mail"
            type="email"
            name="email"
            placeholder="seu@email.com.br"
            value={formData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            required
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="relative">
            <Input
              label="Senha"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Digite sua senha"
              value={formData?.password}
              onChange={handleInputChange}
              error={errors?.password}
              required
              disabled={isLoading}
              className="w-full pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 p-1 rounded-md hover:bg-muted transition-colors"
              disabled={isLoading}
            >
              <Icon 
                name={showPassword ? "EyeOff" : "Eye"} 
                size={16} 
                color="var(--color-text-secondary)" 
              />
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData?.rememberMe}
            onChange={handleInputChange}
            disabled={isLoading}
            className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
          />
          <label htmlFor="rememberMe" className="text-sm text-foreground cursor-pointer">
            Lembrar-me neste dispositivo
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          className="mt-6"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>

        {/* Forgot Password Link */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={isLoading}
            className="text-sm text-primary hover:text-primary/80 transition-colors underline"
          >
            Esqueci minha senha
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
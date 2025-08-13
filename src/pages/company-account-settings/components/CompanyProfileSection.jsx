import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CompanyProfileSection = () => {
  const [companyData, setCompanyData] = useState({
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Tech Solutions Ltda',
    nomeFantasia: 'Tech Solutions',
    inscricaoEstadual: '123.456.789.012',
    inscricaoMunicipal: '987654321',
    endereco: 'Rua das Flores, 123',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
    telefone: '(11) 3456-7890',
    email: 'contato@techsolutions.com.br',
    website: 'www.techsolutions.com.br',
    regimeTributario: 'simples-nacional',
    anexoSimples: 'anexo-iv',
    dataAbertura: '2020-01-15'
  });

  const [isEditing, setIsEditing] = useState(false);

  const regimeTributarioOptions = [
    { value: 'simples-nacional', label: 'Simples Nacional' },
    { value: 'lucro-presumido', label: 'Lucro Presumido' },
    { value: 'lucro-real', label: 'Lucro Real' }
  ];

  const anexoSimplesOptions = [
    { value: 'anexo-i', label: 'Anexo I - Comércio' },
    { value: 'anexo-ii', label: 'Anexo II - Indústria' },
    { value: 'anexo-iii', label: 'Anexo III - Serviços' },
    { value: 'anexo-iv', label: 'Anexo IV - Serviços' },
    { value: 'anexo-v', label: 'Anexo V - Serviços' }
  ];

  const estadoOptions = [
    { value: 'SP', label: 'São Paulo' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'PR', label: 'Paraná' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'BA', label: 'Bahia' },
    { value: 'GO', label: 'Goiás' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'CE', label: 'Ceará' }
  ];

  const handleInputChange = (field, value) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // In real app, this would save to API
    console.log('Saving company data:', companyData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original data
    setIsEditing(false);
  };

  const validateCNPJ = (cnpj) => {
    // Basic CNPJ validation
    const cleanCNPJ = cnpj?.replace(/[^\d]/g, '');
    return cleanCNPJ?.length === 14;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Perfil da Empresa</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie as informações básicas da sua empresa
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button variant="default" onClick={handleSave}>
                Salvar Alterações
              </Button>
            </>
          ) : (
            <Button variant="outline" iconName="Edit" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
          )}
        </div>
      </div>
      {/* Company Status Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Building2" size={24} color="var(--color-primary)" />
          </div>
          
          <div className="flex-1">
            <h4 className="text-lg font-medium text-foreground">{companyData?.razaoSocial}</h4>
            <p className="text-sm text-muted-foreground">CNPJ: {companyData?.cnpj}</p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-success">Ativa</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{companyData?.regimeTributario}</span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">Abertura</p>
            <p className="text-sm font-medium text-foreground">
              {new Date(companyData.dataAbertura)?.toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
      {/* Company Information Form */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-lg font-medium text-foreground mb-6">Informações da Empresa</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="CNPJ"
            type="text"
            value={companyData?.cnpj}
            onChange={(e) => handleInputChange('cnpj', e?.target?.value)}
            disabled={!isEditing}
            required
            error={!validateCNPJ(companyData?.cnpj) ? 'CNPJ inválido' : ''}
            description="Cadastro Nacional da Pessoa Jurídica"
          />

          <Input
            label="Razão Social"
            type="text"
            value={companyData?.razaoSocial}
            onChange={(e) => handleInputChange('razaoSocial', e?.target?.value)}
            disabled={!isEditing}
            required
          />

          <Input
            label="Nome Fantasia"
            type="text"
            value={companyData?.nomeFantasia}
            onChange={(e) => handleInputChange('nomeFantasia', e?.target?.value)}
            disabled={!isEditing}
          />

          <Input
            label="Inscrição Estadual"
            type="text"
            value={companyData?.inscricaoEstadual}
            onChange={(e) => handleInputChange('inscricaoEstadual', e?.target?.value)}
            disabled={!isEditing}
          />

          <Input
            label="Inscrição Municipal"
            type="text"
            value={companyData?.inscricaoMunicipal}
            onChange={(e) => handleInputChange('inscricaoMunicipal', e?.target?.value)}
            disabled={!isEditing}
          />

          <Input
            label="Data de Abertura"
            type="date"
            value={companyData?.dataAbertura}
            onChange={(e) => handleInputChange('dataAbertura', e?.target?.value)}
            disabled={!isEditing}
          />
        </div>
      </div>
      {/* Address Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-lg font-medium text-foreground mb-6">Endereço</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Endereço"
              type="text"
              value={companyData?.endereco}
              onChange={(e) => handleInputChange('endereco', e?.target?.value)}
              disabled={!isEditing}
              required
            />
          </div>

          <Input
            label="CEP"
            type="text"
            value={companyData?.cep}
            onChange={(e) => handleInputChange('cep', e?.target?.value)}
            disabled={!isEditing}
            required
          />

          <Input
            label="Bairro"
            type="text"
            value={companyData?.bairro}
            onChange={(e) => handleInputChange('bairro', e?.target?.value)}
            disabled={!isEditing}
            required
          />

          <Input
            label="Cidade"
            type="text"
            value={companyData?.cidade}
            onChange={(e) => handleInputChange('cidade', e?.target?.value)}
            disabled={!isEditing}
            required
          />

          <Select
            label="Estado"
            options={estadoOptions}
            value={companyData?.estado}
            onChange={(value) => handleInputChange('estado', value)}
            disabled={!isEditing}
            required
          />
        </div>
      </div>
      {/* Contact Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-lg font-medium text-foreground mb-6">Contato</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Telefone"
            type="tel"
            value={companyData?.telefone}
            onChange={(e) => handleInputChange('telefone', e?.target?.value)}
            disabled={!isEditing}
          />

          <Input
            label="E-mail"
            type="email"
            value={companyData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            disabled={!isEditing}
            required
          />

          <div className="md:col-span-2">
            <Input
              label="Website"
              type="url"
              value={companyData?.website}
              onChange={(e) => handleInputChange('website', e?.target?.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
      {/* Tax Configuration */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-lg font-medium text-foreground mb-6">Configuração Fiscal</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Regime Tributário"
            options={regimeTributarioOptions}
            value={companyData?.regimeTributario}
            onChange={(value) => handleInputChange('regimeTributario', value)}
            disabled={!isEditing}
            required
            description="Regime de tributação da empresa"
          />

          {companyData?.regimeTributario === 'simples-nacional' && (
            <Select
              label="Anexo do Simples Nacional"
              options={anexoSimplesOptions}
              value={companyData?.anexoSimples}
              onChange={(value) => handleInputChange('anexoSimples', value)}
              disabled={!isEditing}
              required
              description="Anexo aplicável para cálculo dos impostos"
            />
          )}
        </div>

        {companyData?.regimeTributario === 'simples-nacional' && (
          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} color="var(--color-primary)" />
              <div>
                <h5 className="font-medium text-primary">Simples Nacional - Anexo IV</h5>
                <p className="text-sm text-muted-foreground mt-1">
                  Alíquotas padrão configuradas automaticamente. Você pode ajustar as taxas na seção de configuração fiscal avançada.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfileSection;
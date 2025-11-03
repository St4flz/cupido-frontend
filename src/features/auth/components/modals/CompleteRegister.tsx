// src/features/auth/components/modals/CompleteRegister.tsx
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CompleteRegisterProps {
  isOpen: boolean;
  onSubmit: (data: any) => void;
  onClose: () => void;
  isSubmitting: boolean;
  initialData?: any;
}

const CompleteRegister: React.FC<CompleteRegisterProps> = ({
  isOpen,
  onSubmit,
  onClose,
  isSubmitting,
  initialData
}) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    genero_id: 0,
    dia: '',
    mes: '',
    año: '',
    descripcion: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ Función para verificar si el formulario es válido
  const isFormValid = () => {
    return (
      formData.nombres.trim() !== '' &&
      formData.apellidos.trim() !== '' &&
      formData.genero_id !== 0 &&
      formData.dia !== '' &&
      formData.mes !== '' &&
      formData.año !== '' &&
      formData.descripcion.trim() !== '' &&
      Object.keys(errors).length === 0
    );
  };

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        nombres: initialData.nombres || '',
        apellidos: initialData.apellidos || '',
        genero_id: initialData.genero_id || 0,
        descripcion: initialData.descripcion || ''
      }));

      if (initialData.fechanacimiento) {
        const [year, month, day] = initialData.fechanacimiento.split('-');
        setFormData(prev => ({
          ...prev,
          dia: day || '',
          mes: month || '',
          año: year || ''
        }));
      }
    }
  }, [initialData]);

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'nombres':
        if (!value) {
          newErrors.nombres = 'El nombre es obligatorio';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          newErrors.nombres = 'Solo letras y espacios';
        } else if (value.length > 50) {
          newErrors.nombres = 'Máximo 50 caracteres';
        } else {
          delete newErrors.nombres;
        }
        break;

      case 'apellidos':
        if (!value) {
          newErrors.apellidos = 'Los apellidos son obligatorios';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          newErrors.apellidos = 'Solo letras y espacios';
        } else if (value.length > 50) {
          newErrors.apellidos = 'Máximo 50 caracteres';
        } else {
          delete newErrors.apellidos;
        }
        break;

      case 'dia':
        if (!value) {
          newErrors.fecha = 'El día es obligatorio';
        } else if (!/^\d{1,2}$/.test(value) || parseInt(value) < 1 || parseInt(value) > 31) {
          newErrors.fecha = 'Día inválido';
        } else {
          delete newErrors.fecha;
        }
        break;

      case 'mes':
        if (!value) {
          newErrors.fecha = 'El mes es obligatorio';
        } else {
          delete newErrors.fecha;
        }
        break;

      case 'año':
        const currentYear = new Date().getFullYear();
        if (!value) {
          newErrors.fecha = 'El año es obligatorio';
        } else if (!/^\d{4}$/.test(value) || parseInt(value) > currentYear - 18) {
          newErrors.fecha = `Mayor de 18 años`;
        } else {
          delete newErrors.fecha;
        }
        break;

      case 'descripcion':
        if (!value) {
          newErrors.descripcion = 'La descripción es obligatoria';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,!?]+$/.test(value)) {
          newErrors.descripcion = 'Solo letras y signos';
        } else if (value.length > 500) {
          newErrors.descripcion = 'Máximo 500 caracteres';
        } else {
          delete newErrors.descripcion;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    validateField(field, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todos los campos antes de enviar
    validateField('nombres', formData.nombres);
    validateField('apellidos', formData.apellidos);
    validateField('dia', formData.dia);
    validateField('mes', formData.mes);
    validateField('año', formData.año);
    validateField('descripcion', formData.descripcion);

    if (formData.genero_id === 0) {
      setErrors(prev => ({ ...prev, genero: 'Selecciona un género' }));
      return;
    }

    if (Object.keys(errors).length > 0) {
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive"
      });
      return;
    }

    // Verificar que todos los campos requeridos estén completos
    if (!isFormValid()) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    const fechaNacimiento = `${formData.año}-${formData.mes.padStart(2, '0')}-${formData.dia.padStart(2, '0')}`;

    const submitData = {
      nombres: formData.nombres.trim(),
      apellidos: formData.apellidos.trim(),
      genero_id: formData.genero_id,
      fechanacimiento: fechaNacimiento,
      descripcion: formData.descripcion.trim()
    };

    onSubmit(submitData);
  };

  if (!isOpen) return null;

  const meses = [
    { value: '01', label: 'Enero' }, { value: '02', label: 'Febrero' }, { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' }, { value: '05', label: 'Mayo' }, { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' }, { value: '08', label: 'Agosto' }, { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' }, { value: '11', label: 'Noviembre' }, { value: '12', label: 'Diciembre' }
  ];

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Campos ultra compactos */}
        <div className="grid gap-2">
          {/* Nombre */}
          <div className="space-y-0.5">
            <label className="block text-black text-xs font-medium font-['Poppins']">
              Nombre:
            </label>
            <input
              type="text"
              value={formData.nombres}
              onChange={(e) => handleChange('nombres', e.target.value)}
              className={`w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E93923] font-['Poppins'] text-xs ${
                errors.nombres ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Tu nombre"
              disabled={isSubmitting}
            />
            {errors.nombres && (
              <p className="text-red-500 text-xs font-['Poppins'] mt-0.5">{errors.nombres}</p>
            )}
          </div>

          {/* Apellidos */}
          <div className="space-y-0.5">
            <label className="block text-black text-xs font-medium font-['Poppins']">
              Apellidos:
            </label>
            <input
              type="text"
              value={formData.apellidos}
              onChange={(e) => handleChange('apellidos', e.target.value)}
              className={`w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E93923] font-['Poppins'] text-xs ${
                errors.apellidos ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Tus apellidos"
              disabled={isSubmitting}
            />
            {errors.apellidos && (
              <p className="text-red-500 text-xs font-['Poppins'] mt-0.5">{errors.apellidos}</p>
            )}
          </div>

          {/* Sexo */}
          <div className="space-y-0.5">
            <label className="block text-black text-xs font-medium font-['Poppins']">
              Sexo:
            </label>
            <select
              value={formData.genero_id}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, genero_id: parseInt(e.target.value) }));
                if (errors.genero) setErrors(prev => ({ ...prev, genero: '' }));
              }}
              className={`w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E93923] font-['Poppins'] text-xs ${
                errors.genero ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            >
              <option value={0}>Selecciona género</option>
              <option value={1}>Masculino</option>
              <option value={2}>Femenino</option>
              <option value={3}>Otro</option>
            </select>
            {errors.genero && (
              <p className="text-red-500 text-xs font-['Poppins'] mt-0.5">{errors.genero}</p>
            )}
          </div>

          {/* Fecha de Nacimiento */}
          <div className="space-y-0.5">
            <label className="block text-black text-xs font-medium font-['Poppins']">
              Fecha de Nacimiento:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <input
                type="text"
                value={formData.dia}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                  handleChange('dia', value);
                }}
                className={`w-full px-1 py-1.5 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-1 focus:ring-[#E93923] font-['Poppins'] text-xs ${
                  errors.fecha ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="DD"
                disabled={isSubmitting}
              />
              
              <select
                value={formData.mes}
                onChange={(e) => handleChange('mes', e.target.value)}
                className={`w-full px-1 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E93923] font-['Poppins'] text-xs ${
                  errors.fecha ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              >
                <option value="">MM</option>
                {meses.map((mes) => (
                  <option key={mes.value} value={mes.value}>
                    {mes.label}
                  </option>
                ))}
              </select>
              
              <input
                type="text"
                value={formData.año}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  handleChange('año', value);
                }}
                className={`w-full px-1 py-1.5 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-1 focus:ring-[#E93923] font-['Poppins'] text-xs ${
                  errors.fecha ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="AAAA"
                disabled={isSubmitting}
              />
            </div>
            {errors.fecha && (
              <p className="text-red-500 text-xs font-['Poppins'] mt-0.5">{errors.fecha}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-0.5">
            <label className="block text-black text-xs font-medium font-['Poppins']">
              Descripción:
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              rows={2}
              className={`w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E93923] font-['Poppins'] text-xs resize-none ${
                errors.descripcion ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Cuéntanos sobre ti..."
              disabled={isSubmitting}
            />
            {errors.descripcion && (
              <p className="text-red-500 text-xs font-['Poppins'] mt-0.5">{errors.descripcion}</p>
            )}
            <p className="text-xs text-gray-500 font-['Poppins']">
              {formData.descripcion.length}/500
            </p>
          </div>
        </div>

        {/* Botón de envío compacto */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className="w-full bg-[#E93923] hover:bg-[#d1321f] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 font-['Poppins'] text-xs"
          >
            {isSubmitting ? 'Guardando...' : 'Continuar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompleteRegister;
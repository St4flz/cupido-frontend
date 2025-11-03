# Auth Feature - Sistema de Autenticación Completo

## 📋 Descripción General

Este módulo maneja todo el sistema de autenticación de la aplicación cUPido, incluyendo registro, login, verificación de email, recuperación de contraseña y gestión de perfiles de usuario.

## 🏗️ Arquitectura del Sistema

### **Estructura de Archivos**
```
src/features/auth/
├── components/           # Componentes reutilizables
│   ├── AuthModal.tsx    # Modal principal de autenticación
│   ├── forms/           # Formularios de auth
│   │   ├── LoginForm.tsx
│   │   ├── SignUpForm.tsx
│   │   └── modals/
│   │       ├── CompleteRegister.tsx
│   │       └── EmailVerificationModal.tsx
│   └── modals/          # Modales específicos
├── pages/               # Páginas de rutas
│   ├── CompleteProfilePage.tsx
│   ├── EmailVerificationPage.tsx
│   ├── ForgotPasswordPage.tsx
│   └── ResetPasswordPage.tsx
├── hooks/               # Hooks personalizados
│   ├── useAuth.ts
│   └── useEmailVerification.ts
├── lib/                 # Utilidades y API
│   ├── authAPI.ts
│   └── validations.ts
├── routes/              # Configuración de rutas
│   └── authRoutes.tsx
├── types/               # Definiciones de tipos
└── utils/               # Utilidades auxiliares
```

## 🔄 Flujos de Autenticación

### **1. Registro de Usuario**
```
Usuario hace clic "Crear cuenta"
    ↓
Modal AuthModal se abre con SignUpForm
    ↓
Usuario llena formulario + reCAPTCHA
    ↓
API: POST /auth/register/
    ↓
Redirección a /auth/verify-email
    ↓
Usuario verifica email con código
    ↓
API: POST /auth/verify-email/
    ↓
Redirección a /auth/complete-register
    ↓
Usuario completa perfil
    ↓
API: PATCH /auth/user-update/
    ↓
Login automático + Dashboard
```

### **2. Inicio de Sesión**
```
Usuario hace clic "Ingresar"
    ↓
Modal AuthModal se abre con LoginForm
    ↓
Usuario ingresa credenciales + reCAPTCHA
    ↓
API: POST /auth/login/
    ↓
Validación de estado de cuenta:
├── Estado '-1' o '-2' → Error (cuenta suspendida)
├── Estado '1' → Redirección a completar perfil
└── Estados '0', '3', '2' → Dashboard
```

### **3. Recuperación de Contraseña**
```
Usuario hace clic "Olvidé contraseña"
    ↓
Página /auth/forgot-password
    ↓
Usuario ingresa email institucional
    ↓
API: POST /auth/password-reset/
    ↓
Redirección a /auth/verify-email (modo password-reset)
    ↓
Usuario verifica código
    ↓
Redirección a /auth/reset-password
    ↓
Usuario establece nueva contraseña
    ↓
API: POST /auth/password-reset-confirm/
    ↓
Redirección automática al login
```

## 🎯 Estados de Cuenta

| Estado | Descripción | Comportamiento |
|--------|-------------|---------------|
| `-2` | Cuenta desactivada | ❌ Login bloqueado |
| `-1` | Cuenta suspendida | ❌ Login bloqueado |
| `0` | Activo completo | ✅ Dashboard |
| `1` | Perfil incompleto | 🔄 Completar perfil |
| `2` | Estado alternativo | ✅ Dashboard |
| `3` | Estado especial | ✅ Dashboard |

## 🔧 Componentes Principales

### **AuthModal**
- **Ubicación**: `components/AuthModal.tsx`
- **Función**: Modal unificado que contiene LoginForm y SignUpForm
- **Props**:
  - `isOpen`: Controla visibilidad
  - `onClose`: Handler para cerrar
  - `initialMode`: Modo inicial ('login' | 'register')

### **Formularios**
- **LoginForm**: Maneja inicio de sesión con validación de estados
- **SignUpForm**: Maneja registro con validaciones complejas
- **CompleteRegister**: Formulario de perfil con campos dinámicos

### **Páginas**
- **EmailVerificationPage**: Verificación de código con countdown
- **CompleteProfilePage**: Layout personalizado para completar perfil
- **ForgotPasswordPage**: Solicitud de recuperación
- **ResetPasswordPage**: Establecimiento de nueva contraseña

## 🌐 API Endpoints

### **Autenticación Base**
```typescript
// Registro
POST /auth/register/
{
  email: string,
  contrasena: string,
  recaptcha_token: string,
  tyc: boolean
}

// Login
POST /auth/login/
{
  email: string,
  contrasena: string,
  recaptcha_token: string
}

// Verificación de email
POST /auth/verify-email/
{
  email: string,
  code: string
}
```

### **Gestión de Perfil**
```typescript
// Actualizar perfil
PATCH /auth/user-update/
{
  nombres: string,
  apellidos: string,
  genero_id: number,
  fechanacimiento: string,
  descripcion: string
}

// Obtener perfil
GET /auth/user-get/
```

### **Recuperación de Contraseña**
```typescript
// Solicitar recuperación
POST /auth/password-reset/
{ email: string }

// Confirmar nueva contraseña
POST /auth/password-reset-confirm/
{
  email: string,
  token: string,
  nueva_contrasena: string
}
```

## 🔒 Seguridad y Validaciones

### **Validaciones Frontend**
- **Email**: Solo dominios institucionales (@unipamplona.edu.co)
- **Contraseña**: Mínimo 8 caracteres, mayúscula, minúscula, número, especial
- **reCAPTCHA**: Obligatorio en login y registro
- **Campos requeridos**: Todos los campos validados en tiempo real

### **Validaciones Backend**
- **Token JWT**: Automático refresh con interceptores
- **Estados de cuenta**: Validación en cada login
- **Sesión persistente**: LocalStorage con tokens seguros

## 🎨 Diseño y UX

### **Responsive Design**
- ✅ Todas las páginas son completamente responsive
- ✅ Breakpoints: `sm`, `md`, `lg`, `xl`
- ✅ Layouts adaptativos para móvil y desktop

### **Estados de Carga**
- ✅ Spinners en botones durante requests
- ✅ Estados de carga en formularios
- ✅ Feedback visual inmediato

### **Manejo de Errores**
- ✅ Mensajes de error específicos por campo
- ✅ Toast notifications para feedback general
- ✅ Estados de error visuales en formularios

## 🔄 Integración con Store

### **Zustand Store**
```typescript
interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  // Estados del modal
  authModal: AuthModalState;
  openLogin: () => void;
  openSigUp: () => void;
}
```

### **Sincronización**
- ✅ Estado global actualizado después de login/logout
- ✅ Persistencia automática en localStorage
- ✅ Sincronización entre componentes

## 🚀 Rutas y Navegación

### **Rutas Públicas**
```typescript
/auth/verify-email     → EmailVerificationPage
/auth/complete-register → CompleteProfilePage
/auth/forgot-password  → ForgotPasswordPage
/auth/reset-password   → ResetPasswordPage
```

### **Navegación Condicional**
- ✅ Redirecciones basadas en estado de autenticación
- ✅ Protección de rutas según permisos
- ✅ Estados de carga durante navegación

## 📱 Modal vs Páginas

### **Modal (Home Page)**
- ✅ Rápido acceso desde header/hero
- ✅ No interrumpe navegación
- ✅ Contexto mantenido

### **Páginas Dedicadas**
- ✅ URLs específicas para compartir
- ✅ Mejor SEO
- ✅ Navegación directa posible

## 🧪 Testing y Calidad

### **Validaciones**
- ✅ Formularios con validación en tiempo real
- ✅ Mensajes de error específicos
- ✅ Estados de carga apropiados

### **Build**
- ✅ Compilación exitosa sin errores
- ✅ TypeScript types correctos
- ✅ ESLint pasando

### **Responsive**
- ✅ Todas las páginas probadas en móvil/desktop
- ✅ Breakpoints funcionando correctamente

## 🔧 Configuración

### **Variables de Entorno**
```bash
# .env
VITE_API_BASE_URL=http://localhost:8000/api/v1

# .env.example (incluido en repo)
VITE_API_BASE_URL=YOUR_API_URL_HERE
```

### **Dependencias**
```json
{
  "react-router-dom": "^6.x",
  "zustand": "^4.x",
  "@hookform/resolvers": "^3.x",
  "axios": "^1.x"
}
```

## 📈 Métricas y Rendimiento

- ✅ **Bundle size**: Optimizado con code splitting
- ✅ **Lazy loading**: Componentes cargados bajo demanda
- ✅ **Caching**: API responses cacheadas apropiadamente
- ✅ **Error boundaries**: Manejo robusto de errores

## 🎯 Próximos Pasos

### **Mejoras Pendientes**
- [ ] Implementar login con redes sociales
- [ ] Agregar autenticación de dos factores
- [ ] Mejorar UX de recuperación de contraseña
- [ ] Implementar refresh tokens automático

### **Mantenimiento**
- [ ] Actualizar validaciones según requerimientos
- [ ] Monitorear métricas de conversión
- [ ] Optimizar performance según uso real

---

**Estado**: ✅ **Completamente funcional y documentado**
**Última actualización**: Noviembre 2024
**Versión**: 1.0.0
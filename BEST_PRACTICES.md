# 📘 Project Best Practices

## 1. Project Purpose
This is a React-based event marketplace frontend application that allows users to browse, book, and manage events. The platform supports multiple user roles (user, organizer, admin) with role-based access control. It integrates with a backend API for authentication, event management, and booking functionality.

## 2. Project Structure
- **`src/`** - Main source directory
  - **`components/`** - Reusable UI components (EventCard, Navbar, Footer, etc.)
  - **`pages/`** - Route-specific page components organized by user role (Admin/, Dashboard/, Organizer/, User/)
  - **`context/`** - React Context providers (AuthContext for authentication state)
  - **`services/`** - API integration layer (axios configuration, API helpers)
  - **`types/`** - TypeScript type definitions (Events.ts, context types)
  - **`layouts/`** - Layout components for different sections
  - **`routes/`** - Route configuration and navigation logic
  - **`assets/`** - Static assets (images, icons)
  - **`config/`** - Configuration files
- **Root level** - Configuration files (Vite, TypeScript, ESLint, Tailwind)

## 3. Test Strategy
- **Framework**: No testing framework currently configured
- **Recommendation**: Consider adding Jest + React Testing Library for unit tests
- **Testing Philosophy**: Focus on component behavior, user interactions, and API integration points
- **Coverage**: Prioritize testing authentication flows, protected routes, and critical user journeys

## 4. Code Style
- **TypeScript**: Strict mode enabled with comprehensive type checking
- **React**: Functional components with hooks (useState, useEffect, useContext)
- **Async Operations**: Use async/await pattern consistently
- **Error Handling**: Implement try-catch blocks for API calls with user-friendly error messages
- **Naming Conventions**:
  - Components: PascalCase (e.g., `EventCard`, `AuthContext`)
  - Files: PascalCase for components, camelCase for utilities
  - Variables/Functions: camelCase (e.g., `fetchEvents`, `isAuthenticated`)
  - Types/Interfaces: PascalCase (e.g., `User`, `AuthContextType`)
- **Imports**: Use absolute imports from `src/` directory
- **Comments**: Include JSDoc-style comments for complex functions and type definitions

## 5. Common Patterns
- **Context Pattern**: Use React Context for global state (authentication, user data)
- **Custom Hooks**: Extract reusable logic into custom hooks (e.g., `useAuth`)
- **Protected Routes**: Wrap sensitive routes with `ProtectedRoute` component for role-based access
- **Error Boundaries**: Use `ErrorBoundary` components to catch and handle React errors gracefully
- **API Integration**: Centralized API configuration using axios with interceptors for authentication
- **Loading States**: Implement loading indicators for async operations
- **Conditional Rendering**: Use ternary operators and logical AND for conditional UI rendering

## 6. Do's and Don'ts
### ✅ Do's
- Always use TypeScript interfaces for props and state
- Implement proper error handling for all API calls
- Use environment variables for configuration (VITE_API_BASE_URL)
- Validate user authentication and roles before rendering protected content
- Use semantic HTML elements and proper accessibility attributes
- Implement loading states for better user experience
- Use React.FC type annotation for functional components
- Extract reusable logic into custom hooks
- Use proper TypeScript typing for all variables and functions

### ❌ Don'ts
- Don't use `any` type - always provide specific types
- Don't forget to handle error states in components
- Don't hardcode API URLs - use environment variables
- Don't bypass TypeScript strict mode warnings
- Don't forget to clean up useEffect subscriptions
- Don't use inline styles - prefer Tailwind CSS classes
- Don't ignore ESLint warnings - address them promptly
- Don't store sensitive data in localStorage without encryption

## 7. Tools & Dependencies
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for utility-first styling
- **Routing**: React Router DOM for client-side routing
- **HTTP Client**: Axios for API requests
- **Authentication**: Custom auth context with JWT token handling
- **Icons**: React Icons library
- **Linting**: ESLint with TypeScript and React plugins
- **OAuth**: Google OAuth integration (@react-oauth/google)

### Setup Instructions
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run lint        # Run ESLint
```

## 8. Other Notes
- **Environment Variables**: Use VITE_ prefix for environment variables accessible in the frontend
- **API Response Handling**: Implement flexible response parsing to handle different API response structures
- **Role-Based Access**: Always check user roles before rendering role-specific content
- **Token Management**: Store JWT tokens in localStorage with proper validation
- **Error Logging**: Use console.error for debugging but implement proper error reporting for production
- **State Management**: Use React Context for global state, local state for component-specific data
- **Performance**: Consider implementing React.memo for expensive components
- **Accessibility**: Ensure proper ARIA labels and keyboard navigation support
- **Mobile Responsiveness**: Use Tailwind's responsive utilities for mobile-first design
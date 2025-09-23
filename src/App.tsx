import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import EventList from './components/EventList'
import EventDetail from './components/EventDetail'
import LoginForm from './components/Authentication/LoginForm'
import SignupForm from './components/Authentication/SignUpForm'
import ReservationForm from './components/ReservationForm'
import ErrorBoundary from './components/ErrorBoundary'
import Events from './pages/Events'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard/Dashboard'
import OrganizerDashboard from './pages/Organizer/Dashboard'
import AdminDashboard from './pages/Admin/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import CartPage from './pages/CartPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <ErrorBoundary>
                <EventList />
              </ErrorBoundary>
            </>
          } />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/events/:eventId" element={<EventDetail/>} />
          <Route path="/reserve" element={<ReservationForm />} />
          <Route path="/events" element={<Events />} />
          <Route path="/dashboard/*" element={
            <ProtectedRoute allowedRoles={['attendee']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/organizer/*" element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <OrganizerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
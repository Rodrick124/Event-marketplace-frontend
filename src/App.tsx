import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import EventList from './components/EventList'
import EventDetail from './components/EventDetail'
import LoginForm from './components/Authentication/LoginForm'
import SignupForm from './components/Authentication/SignUpForm'
import ReservationForm from './components/ReservationForm'
import ErrorBoundary from './components/ErrorBoundary'
import Events from './pages/Events'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
              <Route path="/event/:id" element={<EventDetail/>} />
              <Route path="/reserve" element={<ReservationForm />} />
              <Route path="/events" element={<Events />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

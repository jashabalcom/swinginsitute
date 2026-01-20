import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { MobileCTABar } from "@/components/layout/MobileCTABar";
import Index from "./pages/Index";
import Masterclass from "./pages/Masterclass";
import TrainAtlanta from "./pages/TrainAtlanta";
import TrainOnline from "./pages/TrainOnline";
import Hybrid from "./pages/Hybrid";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FreeSignup from "./pages/FreeSignup";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import TrainingRoom from "./pages/TrainingRoom";
import Book from "./pages/Book";
import BookCall from "./pages/BookCall";
import BookMindset from "./pages/BookMindset";
import Packages from "./pages/Packages";
import MyBookings from "./pages/MyBookings";
import AdminSchedule from "./pages/AdminSchedule";
import AdminServiceTypes from "./pages/AdminServiceTypes";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMembers from "./pages/AdminMembers";
import AdminPackages from "./pages/AdminPackages";
import AdminVideos from "./pages/AdminVideos";
import AdminDrills from "./pages/AdminDrills";
import AdminAcademy from "./pages/AdminAcademy";
import Settings from "./pages/Settings";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import CompleteAccount from "./pages/CompleteAccount";
import Upgrade from "./pages/Upgrade";
import Academy from "./pages/Academy";
import AcademyLevel from "./pages/AcademyLevel";
import AcademyModule from "./pages/AcademyModule";
import AcademyLesson from "./pages/AcademyLesson";
import Events from "./pages/Events";

const queryClient = new QueryClient();

// Pages where MobileCTABar should be shown
const MOBILE_CTA_PAGES = ["/", "/train-online", "/train-atlanta", "/hybrid", "/about", "/masterclass"];

function AppContent() {
  const location = useLocation();
  const showMobileCTA = MOBILE_CTA_PAGES.includes(location.pathname);

  return (
    <AuthProvider>
      {showMobileCTA && <MobileCTABar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/masterclass" element={<Masterclass />} />
        <Route path="/train-atlanta" element={<TrainAtlanta />} />
        <Route path="/train-online" element={<TrainOnline />} />
        <Route path="/hybrid" element={<Hybrid />} />
        <Route path="/about" element={<About />} />
        <Route path="/book-call" element={<BookCall />} />
        <Route path="/book-mindset" element={<BookMindset />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/complete-account" element={<CompleteAccount />} />
        <Route
          path="/upgrade"
          element={
            <ProtectedRoute>
              <Upgrade />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/free-signup" element={<FreeSignup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/training-room"
          element={
            <ProtectedRoute>
              <TrainingRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book"
          element={
            <ProtectedRoute>
              <Book />
            </ProtectedRoute>
          }
        />
        <Route
          path="/packages"
          element={
            <ProtectedRoute>
              <Packages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/academy"
          element={
            <ProtectedRoute>
              <Academy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/academy/level/:levelSlug"
          element={
            <ProtectedRoute>
              <AcademyLevel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/academy/level/:levelSlug/module/:moduleSlug"
          element={
            <ProtectedRoute>
              <AcademyModule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/academy/lesson/:lessonId"
          element={
            <ProtectedRoute>
              <AcademyLesson />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/schedule"
          element={
            <AdminRoute>
              <AdminSchedule />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <AdminRoute>
              <AdminServiceTypes />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/members"
          element={
            <AdminRoute>
              <AdminMembers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/packages"
          element={
            <AdminRoute>
              <AdminPackages />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/videos"
          element={
            <AdminRoute>
              <AdminVideos />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/drills"
          element={
            <AdminRoute>
              <AdminDrills />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/academy"
          element={
            <AdminRoute>
              <AdminAcademy />
            </AdminRoute>
          }
        />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

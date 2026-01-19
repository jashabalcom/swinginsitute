import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Masterclass from "./pages/Masterclass";
import TrainAtlanta from "./pages/TrainAtlanta";
import TrainOnline from "./pages/TrainOnline";
import Hybrid from "./pages/Hybrid";
import About from "./pages/About";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/masterclass" element={<Masterclass />} />
          <Route path="/train-atlanta" element={<TrainAtlanta />} />
          <Route path="/train-online" element={<TrainOnline />} />
          <Route path="/hybrid" element={<Hybrid />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

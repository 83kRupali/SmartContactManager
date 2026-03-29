import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";
import AppNavbar from "@/components/AppNavbar";
import Dashboard from "@/pages/Dashboard";
import ContactsList from "@/pages/ContactsList";
import AddContact from "@/pages/AddContact";
import EditContact from "@/pages/EditContact";
import ViewContact from "@/pages/ViewContact";
import FavouriteContacts from "@/pages/FavouriteContacts";
import ArchivedContacts from "@/pages/ArchivedContacts";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleDark = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDarkMode(isDark);
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden md:block">
        <AppSidebar darkMode={darkMode} toggleDark={toggleDark} />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <AppNavbar darkMode={darkMode} toggleDark={toggleDark} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/contacts" element={<ContactsList />} />
            <Route path="/contacts/add" element={<AddContact />} />
            <Route path="/contacts/edit/:id" element={<EditContact />} />
            <Route path="/contacts/:id" element={<ViewContact />} />
            <Route path="/favorites" element={<FavouriteContacts />} />
            <Route path="/archived" element={<ArchivedContacts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Depreciation from "./pages/depreciation";
import Invoicing from "./pages/invoicing";
import Attendance from "./pages/attendance";
import Recruitment from "./pages/recruitment";
import Tickets from "./pages/tickets";
import Subscriptions from "./pages/subscriptions";
import Assets from "./pages/assets";
import ShopIncomeExpense from "./pages/shop-income-expense";
import Inventory from "./pages/inventory";
import CRM from "./pages/crm";
import LeadsListPage from "./pages/crm/leads";
import NewLeadPage from "./pages/crm/leads/new";
import CustomersListPage from "./pages/crm/customers";
import OpportunitiesPage from "./pages/crm/opportunities";
import QuotesListPage from "./pages/crm/quotes";
import Marketing from "./pages/marketing";
import PersonalExpense from "./pages/personal-expense";
import Contact from "./pages/contact";
import Admin from "./pages/admin/index";
import Login from "./pages/Login";
import AuthConfirm from "./pages/AuthConfirm";

import Profile from "./pages/Profile";
import InitializeAdmin from "./pages/InitializeAdmin";
import PasswordReset from "./pages/PasswordReset";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import AcceptInvitation from "./pages/AcceptInvitation";
import SuperAdmin from "./pages/super-admin/index";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/confirm" element={<AuthConfirm />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/reset-password-confirm" element={<ResetPasswordConfirm />} />
          <Route path="/accept-invitation" element={<AcceptInvitation />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Profile />} />
          <Route path="/initialize-admin" element={<InitializeAdmin />} />
          <Route path="/depreciation" element={<Depreciation />} />
          <Route path="/invoicing" element={<Invoicing />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/recruitment" element={<Recruitment />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/shop-income-expense" element={<ShopIncomeExpense />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/crm/leads" element={<LeadsListPage />} />
          <Route path="/crm/leads/new" element={<NewLeadPage />} />
          <Route path="/crm/customers" element={<CustomersListPage />} />
          <Route path="/crm/opportunities" element={<OpportunitiesPage />} />
          <Route path="/crm/quotes" element={<QuotesListPage />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/personal-expense" element={<PersonalExpense />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/super-admin" element={<SuperAdmin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;

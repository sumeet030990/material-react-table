import React from 'react';
import './App.css';
import { AppProvider, DashboardLayout } from '@toolpad/core';
import Users from './components/Users';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const queryClient = new QueryClient();
  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <DashboardLayout>
          <Users />
        </DashboardLayout>
      </QueryClientProvider>
    </AppProvider>
  );
}

export default App;

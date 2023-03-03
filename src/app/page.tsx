'use client';
import { QueryClient } from 'react-query';
import { QueryClientProvider, useQuery } from 'react-query';
import Home from './components/Home';
import { ReactQueryDevtools } from 'react-query/devtools'

const queryClient = new QueryClient()
const App = () => {
  return (
      <QueryClientProvider client={queryClient}>
        <Home/>
        <ReactQueryDevtools/>
      </QueryClientProvider>
  )
}

export default App;

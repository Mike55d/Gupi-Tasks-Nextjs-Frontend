'use client';
import { QueryClient } from 'react-query';
import { QueryClientProvider, useQuery } from 'react-query';
import Home from '../components/Home';
import { ReactQueryDevtools } from 'react-query/devtools'

const queryClient = new QueryClient()
const App = ({ params: { lng } }:any) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Home lng={lng} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default App;

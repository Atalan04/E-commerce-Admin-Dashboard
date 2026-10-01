import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Router from "./router/Router";
import defaultOptions from "./configs/reactQueryConfigs";
import AuthContextProvider from "./contexts/AuthContextProvider";

const queryClient = new QueryClient({ defaultOptions });

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthContextProvider>
          <Router />
        </AuthContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

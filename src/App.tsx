import { Container } from "@mui/material";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import { AppRoutes } from "./routes/AppRoutes";
import { AccountProvider } from "./context/AccountContext";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <AccountProvider>
        <Toaster richColors position="top-right" />
        <Container sx={{ mt: 4 }}>
          <Navbar>
            <AppRoutes />
          </Navbar>
        </Container>
      </AccountProvider>
    </ErrorBoundary>
  );
}

export default App;

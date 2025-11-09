import { Container } from "@mui/material";
import Navbar from "./components/Navbar";
import { AppRoutes } from "./routes/AppRoutes";
import { AccountProvider } from "./context/AccountContext";

function App() {
  return (
    <AccountProvider>
      <Container sx={{ mt: 4 }}>
        <Navbar>
          <AppRoutes />
        </Navbar>
      </Container>
    </AccountProvider>
  );
}

export default App;

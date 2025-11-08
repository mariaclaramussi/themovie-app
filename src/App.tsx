import { Container } from "@mui/material";
import Navbar from "./components/Navbar";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <Container sx={{ mt: 4 }}>
      <Navbar>
        <AppRoutes />
      </Navbar>
    </Container>
  );
}

export default App;

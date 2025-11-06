import { Container } from "@mui/material";
import AppRoutes from "./AppRoutes";
import Navbar from "./components/Navbar";

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

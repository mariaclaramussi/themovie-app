import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from "react-error-boundary";
import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { ReactNode } from "react";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  console.error("ErrorBoundary caught an error:", error);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        textAlign: "center",
        p: 3,
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Algo deu errado
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Ocorreu um erro inesperado. Por favor, tente novamente.
      </Typography>
      <Button variant="contained" color="primary" onClick={resetErrorBoundary}>
        Tentar novamente
      </Button>
    </Box>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

interface GoBackButtonProps {
  label?: string;
  to?: string;
}

export const GoBackButton = (props: GoBackButtonProps) => {
  const { label = "Voltar", to } = props;
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      startIcon={<ArrowBackIcon />}
      onClick={handleGoBack}
      variant="outlined"
      color="primary"
    >
      {label}
    </Button>
  );
};

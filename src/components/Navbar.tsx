import {
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  ListItem,
  ListItemIcon,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactElement } from "react";
import MovieIcon from "@mui/icons-material/Movie";
import HomeIcon from "@mui/icons-material/Home";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "center",
}));

const Navbar = ({
  children,
}: {
  children: ReactElement;
}): ReactElement | null => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  console.log(isAuthenticated);

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open
      >
        <DrawerHeader>
          <h1>Header</h1>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            { text: "Início", icon: <HomeIcon />, path: "/" },
            { text: "Detalhes", icon: <MovieIcon />, path: "/details" },
          ].map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={Link} to={item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            navigate("/logout");
            window.location.reload();
          }}
          sx={{ mt: 2 }}
        >
          Sair
        </Button>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: `${drawerWidth}px`,
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default Navbar;

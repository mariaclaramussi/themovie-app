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
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactElement } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
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
          <Typography variant="h6">The Movie DB</Typography>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            { text: "Home", icon: <HomeOutlinedIcon />, path: "/home" },
            {
              text: "Favoritos",
              icon: <StarOutlinedIcon />,
              path: "/favorites",
            },
          ].map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={Link} to={item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "end",
            paddingBottom: 3,
          }}
        >
          <Divider />
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              navigate("/logout");
              window.location.reload();
            }}
            sx={{ width: "80%", margin: "0 auto", mt: 2 }}
          >
            Sair
          </Button>
        </Box>
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

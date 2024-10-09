import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import DescriptionIcon from "@mui/icons-material/Description";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  AppBar,
  Button,
  Menu,
  MenuItem,
  Toolbar
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Estado para controlar o popup
  const open = Boolean(anchorEl); // Booleano que controla se o popup está aberto

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Abre o popup
  };

  const handleClose = () => {
    setAnchorEl(null); // Fecha o popup
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleClose(); // Fecha o popup após o logout
  };

  return (
    <AppBar position="static" style={{ marginBottom: "20px" }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          color="inherit"
          onClick={() => navigate("/documents")}
          startIcon={<DescriptionIcon />}
        >
          Meus Documentos
        </Button>
        <Button
          color="inherit"
          onClick={handleMenuClick}
          endIcon={open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        >
          Olá, {user.username}!
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleLogout}>
            <LogoutIcon style={{ marginRight: "8px" }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import styled from "@emotion/styled";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";

const HeaderContainer = styled(AppBar)`
  background-color: #3f51b5;
`;

const Title = styled(Typography)`
  flex-grow: 1;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  margin-left: 10px;
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Title variant="h6">My App</Title>
        <Button color="inherit">
          <StyledLink href="/">Home</StyledLink>
        </Button>
        <Button color="inherit">
          <StyledLink href="/about">About</StyledLink>
        </Button>
        <Button color="inherit">
          <StyledLink href="/contact">Contact</StyledLink>
        </Button>
      </Toolbar>
    </HeaderContainer>
  );
};

export default Header;

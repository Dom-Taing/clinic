import React from "react";
import styled from "@emotion/styled";
import { CircularProgress } from "@mui/material";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(
    0,
    0,
    0,
    0.25
  ); // You can change the background color and opacity here
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface LoadingScreenProps {
  isOn: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isOn = false }) => {
  if (!isOn) return null;
  return (
    <Wrapper>
      <CircularProgress />
    </Wrapper>
  );
};

export default LoadingScreen;

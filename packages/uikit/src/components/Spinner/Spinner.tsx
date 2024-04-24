import React from "react";
import styled, { keyframes } from "styled-components";
import Parrot1 from "./Parrot1";
import Parrot15 from "./Parrot15";
import { SpinnerProps } from "./types";

const float = keyframes`
	0% {
		transform: translatey(0px);
	}
	50% {
		transform: translatey(20px);
	}
	100% {
		transform: translatey(0px);
	}
`;

const rotateimages = keyframes`
	0% {
		visibility: visible;
	}
	50.0% {
		visibility: visible;
	}
	50.1% {
		visibility: hidden;
	}
	100% {
		visibility: hidden;
	}
`;

const Container = styled.div`
  position: relative;
`;

const FloatingParrot1 = styled(Parrot1)`
  animation: ${float} 6s ease-in-out infinite;
  transform: translate3d(0, 0, 0);
`;

const FloatingParrot15 = styled(Parrot15)`
  animation: ${float} 6s ease-in-out infinite;
  transform: translate3d(0, 0, 0);
`;

const RotatingParrot1 = styled(Parrot1)`
  visibility: hidden;
  animation: 1s ${rotateimages} infinite;
  position: absolute;
  animation-delay: 0.5s;
`;

const RotatingParrot15 = styled(Parrot15)`
  visibility: hidden;
  animation: 1s ${rotateimages} infinite;
  animation-delay: 0.5s
  position: absolute;
`;

const Spinner: React.FC<React.PropsWithChildren<SpinnerProps>> = ({ size = 300 }) => {
  return (
    <Container>
      <RotatingParrot1 width={`${size * 0.5}px`} />
      <RotatingParrot15 width={`${size * 0.5}px`} />
    </Container>
  );
};

export default Spinner;

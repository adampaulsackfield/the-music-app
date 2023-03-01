import React, { ReactElement } from "react";
// Components

// Styles
import styles from "./Button.scss";

const Button = ({ buttonLabel, onClick, size }) => {
  return (
    <button onClick={onClick} className={`button__style button__style-${size}`}>
      {buttonLabel}
    </button>
  );
};

export default Button;

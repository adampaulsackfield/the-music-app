import React, { ReactElement } from "react";
// Components

// Styles
import styles from "./Button.scss";

const Button = ({ buttonLabel, onClick }) => {
  return (
    <button onClick={onClick} className="button__style">
      {buttonLabel}
    </button>
  );
};

export default Button;

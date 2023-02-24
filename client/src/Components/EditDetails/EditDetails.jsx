import React, { ReactElement, useState } from "react";
// Components
import Button from "../Button/Button";
// Styles
import styles from "./EditDetails.scss";

const EditDetails = ({ user, handleClick }) => {
  return (
    <div>
      {user && (
        <div className="editDetails-wrap">
          <form className="editDetails__form">
            <label className="editDetails__form__label">Email: </label>
            <input className="editDetails__form__input" value={user.email} />

            <label className="editDetails__form__label">Username: </label>
            <input className="editDetails__form__input" value={user.username} />

            <label className="editDetails__form__label">Display Name: </label>
            <input
              className="editDetails__form__input"
              value={user.displayName}
            />

            <label className="editDetails__form__label">Input Password:</label>
            <input
              className="editDetails__form__input"
              placeholder="Current Password"
            />

            <Button buttonLabel={"Save"}></Button>
            <Button onClick={handleClick} buttonLabel={"Cancel"}></Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditDetails;

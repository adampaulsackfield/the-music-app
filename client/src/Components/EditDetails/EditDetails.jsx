import React, { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateUser } from "../../services/User.service";

// Components
import Button from "../Button/Button";
// Styles
import styles from "./EditDetails.scss";

const EditDetails = ({ user, handleClick, setShowEditForm }) => {
  const [formData, setFormData] = useState(user);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      formData.email === "" ||
      formData.username === "" ||
      formData.password === "" ||
      formData.displayName === ""
    ) {
      return toast.warning("Missing required fields");
    }

    const updatedUser = {
      username: formData.username !== user.username ? formData.username : "",
      displayName:
        formData.displayName !== user.displayName ? formData.displayName : "",
      email: formData.email !== user.email ? formData.email : "",
      password: formData.password,
    };
    //Converting to array of arrays
    //Uses reduce to filter out that have a false eval (null etc)
    //Acc - accumulator, puts stuff
    const refactored = Object.entries(updatedUser).reduce(
      (acc, [k, v]) => (v ? { ...acc, [k]: v } : acc),
      {}
    );

    const response = await updateUser(refactored);
    if (response.success) {
      toast.success(`${response.data.username} has successfully updated.`);
      setShowEditForm(false);
    } else {
      toast.error(response.data);
    }
    setFormData(user);
  };

  const handleInputChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div>
      {user && (
        <div className="editDetails-wrap">
          <form className="editDetails__form">
            <label className="editDetails__form__label">Email: </label>
            <input
              name="email"
              className="editDetails__form__input"
              value={formData.email}
              onChange={(e) => handleInputChange(e)}
            />

            <label className="editDetails__form__label">Username: </label>
            <input
              name="username"
              className="editDetails__form__input"
              value={formData.username}
              onChange={(e) => handleInputChange(e)}
            />

            <label className="editDetails__form__label">Display Name: </label>
            <input
              name="displayName"
              className="editDetails__form__input"
              value={formData.displayName}
              onChange={(e) => handleInputChange(e)}
            />

            <label className="editDetails__form__label">Input Password:</label>
            <input
              name="password"
              className="editDetails__form__input"
              placeholder="Current Password"
              onChange={(e) => handleInputChange(e)}
              value={formData.password}
            />

            <Button
              buttonLabel={"Save"}
              onClick={handleSubmit}
              size="medium"
            ></Button>
            <Button
              onClick={handleClick}
              size="medium"
              buttonLabel={"Cancel"}
            ></Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditDetails;

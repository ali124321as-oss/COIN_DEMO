import React from "react";
import "../alert/alert.css";

const Alert = ({ setisShowAlert }) => {
  return (
    <div className="alert-overlay">
      <div className="alert info fixed-alert">
        <span
          className="closebtn"
          onClick={() => setisShowAlert(false)}
        >
          &times;
        </span>
        <strong >Info!</strong> This is  not you favourite 
      </div>
    </div>
  );
};

export default Alert;

import React from "react";
import { FaSearch } from "react-icons/fa";
import "../../../css/Investigator/InvSearchBar.css";

const InvSearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="investigator-search">
      <div className="investigator-search__wrapper">
        <FaSearch className="investigator-search__icon" />
        <input
          type="text"
          className="investigator-search__input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default InvSearchBar;
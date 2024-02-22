import React, { useState } from "react";

const Dropdown = ({ data, onSelectItem }) => {
  const [isOpen, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleDropdown = () => setOpen(!isOpen);

  const handleItemClick = (id) => {
    setSelectedItem((prevSelectedItem) =>
      prevSelectedItem === id ? null : id
    );
    onSelectItem(id);
  };
  
  return (
    <div className="dropdown select-none">
      <div className="dropdown-header" onClick={toggleDropdown}>
        {selectedItem
          ? data.find((item) => item.projectId === selectedItem).projectName
          : "Enter Client ID"}
        <i className={`fa fa-chevron-right icon ${isOpen && "open"}`}></i>
      </div>
      <div className={`dropdown-body ${isOpen && "open"}`}>
        {data &&
          data.map((item) => (
            <div
              className="dropdown-item"
              onClick={() => handleItemClick(item.projectId)}
              key={item.projectId}
            >
              <span
                className={`dropdown-item-dot ${
                  item.projectId === selectedItem && "selected"
                }`}
              >
                •
              </span>
              {item.projectName}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Dropdown;

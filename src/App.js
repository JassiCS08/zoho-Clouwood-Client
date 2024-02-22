import axios from "axios";
import React, { useEffect, useState } from "react";
import Passcode from "./Components/Passcode";
import AddJobs from "./Components/AddJobs";

const App = () => {
  const [clientID, setClientID] = useState();
  const [authToken, setAuthToken] = useState();
  const [projectRes, setProjectRes] = useState();
  const [selectedProjectID, setSelectedProjectID] = useState(null);

  const handleSelectItem = (selectedItem) => {
    setSelectedProjectID(selectedItem);
  };

  const fetchProject = async () => {
    const apiUrl = `http://localhost:5000/getprojects?clientId=${clientID}&assignedTo=all`;
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: ` Zoho-oauthtoken ${authToken}`,
          "Content-Type": "application/json",
          Accept: "*/*",
        },
      });
      console.log(response.data.response.result);
      setProjectRes(response.data.response.result);
    } catch (error) {
      console.error("Error fetching data:", error);
      console.log(error.message);
    }
  };

  return (
    <>
      <Passcode>
        <AddJobs />
      </Passcode>
    </>
  );
};

export default App;

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const qs = require("qs");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// API endpoint that proxies the Zoho API
app.get("/getprojects", async (req, res) => {
  const clientId = req.query.clientId || "";
  const assignedTo = req.query.assignedTo || "all";
  const authToken = req.headers.authorization;

  try {
    const response = await axios.get(
      `http://people.zoho.in/people/api/timetracker/getprojects?clientId=${clientId}&assignedTo=${assignedTo}`,
      {
        headers: {
          Authorization: ` Zoho-oauthtoken ${authToken}`,
          "Content-Type": "application/json",
          Accept: "*/*",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/addjobs", async (req, res) => {
  const { Job_Name, Project, DepartmentIds, From, To } = req.query;
  const authToken = req.headers.authorization;

  const createJob = async (jobName, project, authToken) => {
    let data = qs.stringify({
      inputData: `{"Job_Name": ${jobName},"StartDate":"01-02-2024","EndDate":"31-12-2024","Project":${project},"Assignees":"All","AssigneeHours":"5;5","AssigneeRate":"10;10","departmentIds":${DepartmentIds}}`,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://people.zoho.in/people/api/forms/json/P_TimesheetJob/insertRecord",
      headers: {
        Authorization: `Zoho-oauthtoken ${authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie:
          "1b7c7929a1=55f6120f27055335daa474ce1d568d26; CSRF_TOKEN=ada58632-3e4e-4a66-894f-a78995eb7526; _zcsr_tmp=ada58632-3e4e-4a66-894f-a78995eb7526; _zpsid=2A8753F365ABC31616FA84EED5072556",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  };

  try {
    if (From && To) {
      const jobsPromises = [];
      for (let i = From; i <= To; i++) {
        jobsPromises.push(createJob(Job_Name + i, Project, authToken));
      }

      const jobResults = await Promise.all(jobsPromises);
      res.json(jobResults);
    } else {
      // Run the function only once
      const result = await createJob(Job_Name, Project, authToken);
      res.json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

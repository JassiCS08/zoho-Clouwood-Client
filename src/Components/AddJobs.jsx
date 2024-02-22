import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "./SVG/Loader";

const AddJobs = () => {
  const [clientID, setClientID] = useState("");
  const [project, setProject] = useState("");
  const [departmentIds, setDepartmentIds] = useState("");
  const [job, setJob] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [projectRes, setProjectRes] = useState();
  const [selectedProjectID, setSelectedProjectID] = useState(null);
  const [range, setRange] = useState(0);
  const [rangeFrom, setRangeFrom] = useState(0);
  const [rangeTo, setRangeTo] = useState(0);
  const [multipleJobs, setMultipleJobs] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const diff = rangeTo + 1 - rangeFrom;
    setRange(diff > 0 ? diff : 0);
  }, [rangeFrom, rangeTo]);

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

  const addJob = async (e) => {
    e.preventDefault();
    setShowLoader(true);
    try {
      const emptyFields = [];
      if (!authToken) {
        emptyFields.push("Auth Token");
      }
      if (!job) {
        emptyFields.push("Job Name");
      }
      if (!project) {
        emptyFields.push("Project");
      }
      if (!departmentIds) {
        emptyFields.push("Department IDs");
      }
      if (emptyFields.length > 0) {
        emptyFields.forEach((field) => {
          toast.error(`${field} is required`);
        });
        return;
      }
      if (rangeFrom > rangeTo) {
        toast.error("'Range From' should be less than or equal to 'Range To'");
        return;
      }

      const apiUrl = multipleJobs
        ? `https://zoho-clouwood-client.onrender.com/addjobs?Job_Name=${job}&Project=${project}&ProjectDepartmentIds=${departmentIds}&From=${rangeFrom}&To=${rangeTo}`
        : `https://zoho-clouwood-client.onrender.com/addjobs?Job_Name=${job}&Project=${project}&ProjectDepartmentIds=${departmentIds}`;

      const response = await axios.post(apiUrl, null, {
        headers: {
          Authorization: authToken,
          Accept: "*/*",
        },
      });

      console.log(response.data);
      setShowLoader(false);
      toast.success("Job added successfully");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setShowLoader(false);
    }
  };

  const addJobDirect = async (e) => {
    e.preventDefault();
    setShowLoader(true);
    try {
      const emptyFields = [];
      if (!authToken) {
        emptyFields.push("Auth Token");
      }
      if (!job) {
        emptyFields.push("Job Name");
      }
      if (!project) {
        emptyFields.push("Project");
      }
      if (!departmentIds) {
        emptyFields.push("Department IDs");
      }
      if (emptyFields.length > 0) {
        emptyFields.forEach((field) => {
          toast.error(`${field} is required`);
        });
        return;
      }
      if (rangeFrom > rangeTo) {
        toast.error("'Range From' should be less than or equal to 'Range To'");
        return;
      }

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
        if (From > 0 && To > 0) {
          const jobsPromises = [];
          for (let i = From; i <= To; i++) {
            jobsPromises.push(createJob(job + i, project, authToken));
          }

          const jobResults = await Promise.all(jobsPromises);
          toast.success("Jobs added successfully");
        } else {
          const result = await createJob(job, project, authToken);
          toast.success("Job added successfully");
        }
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setShowLoader(false);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-md shadow-md">
        <form onSubmit={addJob}>
          <div className="mb-4">
            <label
              htmlFor="authToken"
              className="block text-sm font-medium text-gray-600"
            >
              Enter Auth-Token
            </label>
            <input
              type="text"
              id="authToken"
              name="authToken"
              className="mt-1 p-2 w-full border rounded-md"
              value={authToken}
              required
              onChange={(e) => {
                setAuthToken(e.target.value);
              }}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="client"
              className="block text-sm font-medium text-gray-600"
            >
              Enter ClientID:
            </label>
            <input
              type="text"
              id="client"
              name="client"
              className="mt-1 p-2 w-full border rounded-md"
              value={clientID}
              onChange={(e) => {
                setClientID(e.target.value);
              }}
            />
          </div>
          <div className="my-4">
            <label
              htmlFor="project"
              className="block text-sm font-medium text-gray-600"
            >
              Enter ProjectID:
            </label>
            <input
              type="text"
              id="project"
              name="project"
              className="mt-1 p-2 w-full border rounded-md"
              value={project}
              required
              onChange={(e) => {
                setProject(e.target.value);
              }}
            />
          </div>
          <div className="my-4">
            <label
              htmlFor="departmentIds"
              className="block text-sm font-medium text-gray-600"
            >
              Enter DepartmentIDs:
            </label>
            <input
              type="text"
              id="departmentIds"
              name="departmentIds"
              className="mt-1 p-2 w-full border rounded-md"
              value={departmentIds}
              required
              onChange={(e) => {
                setDepartmentIds(e.target.value);
              }}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="job"
              className="block text-sm font-medium text-gray-600"
            >
              {`  Enter ${multipleJobs ? "Base" : "Job"}  Name:`}
            </label>
            <input
              type="text"
              id="job"
              name="job"
              required
              className="mt-1 p-2 w-full border rounded-md"
              value={job}
              onChange={(e) => {
                setJob(e.target.value);
              }}
            />
          </div>
          <div className="mb-4">
            <div className="flex gap-4">
              <label
                htmlFor="job"
                className="block text-sm font-medium text-gray-600"
              >
                Multiple Jobs?
              </label>
              <input
                type="checkbox"
                onChange={() => setMultipleJobs((prev) => !prev)}
              />
            </div>
            {multipleJobs && (
              <>
                <div className="flex  items-center justify-center p-2 gap-6">
                  <div className="flex gap-3 items-center  justify-center">
                    <span className="text-[13px]">From:</span>
                    <div>
                      <input
                        type="number"
                        className={`p-1 text-[14px] w-[65px] rounded-[10px] focus:ring-0 focus:outline-0 border border-black`}
                        value={rangeFrom}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setRangeFrom(value < 1 ? 1 : value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex p-2 gap-3 items-center justify-center">
                    <span className="text-[13px]">To:</span>
                    <div>
                      <input
                        type="number"
                        className={`p-1 text-[14px] w-[65px] rounded-[10px] focus:ring-0 focus:outline-0 border border-black`}
                        value={rangeTo}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setRangeTo(value < 1 ? 1 : value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-center w-full">
                  <span
                    className={`form-label ${
                      (range === 0 || range > 250) && "text-red-500"
                    }`}
                  >
                    Total Jobs: {range} (max limit 250)
                  </span>
                </div>
              </>
            )}
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 flex items-center gap-2"
          >
            Submit to add Jobs
            {showLoader && <Loader />}{" "}
          </button>
        </form>
      </div>
      <button
        type="submit"
        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 flex items-center gap-2"
        onClick={addJobDirect}
      >
        Submit to add Jobs Directly
        {showLoader && <Loader />}{" "}
      </button>
    </>
  );
};

export default AddJobs;

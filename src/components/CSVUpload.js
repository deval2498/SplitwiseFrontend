import React, { useState, useEffect } from "react";
import "./CSVUpload.css";
import api from "../api";
import config from "../config";
import Select, { components } from "react-select";
import Checkbox from "@mui/material/Checkbox";
import TransactionsTable from "./TransactionsTable";
import Header from "./Header"; // Adjust the path based on your project structure

const CheckboxOption = (props) => {
  return (
    <components.Option {...props}>
      <Checkbox
        checked={props.isSelected}
        color="primary"
        style={{ marginRight: "8px" }}
      />
      {props.label}
    </components.Option>
  );
};

const CSVUpload = () => {
  const [file, setFile] = useState(null);
  const [dropdown1, setDropdown1] = useState("");
  const [dropdown2, setDropdown2] = useState(() => {
    const storedOptions = localStorage.getItem("friends_data");
    return storedOptions ? JSON.parse(storedOptions) : [];
  });
  const [data, setData] = useState([]);
  const [userdata, setUserdata] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(config.groupApiUrl);
        setData(response.data.result);
        try {
          const friendsResponse = await api.get(config.friendsApiUrl);
          setUserdata(friendsResponse.data.result);
        } catch (err) {
          console.err("Error fetching friends data:", err);
        }
        if (localStorage.getItem("groups_data")) {
          setDropdown1(localStorage.getItem("groups_data"));
        }
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUploading(true);
    if (!file) {
      setUploading(false);
      alert("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    localStorage.setItem("groups_data", dropdown1);
    localStorage.setItem("friends_data", JSON.stringify(dropdown2));

    try {
      const response = await api.post(config.uploadApiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const updatedTransactions = response.data.result.map((transaction) => ({
        ...transaction,
        group: dropdown1,
        users: dropdown2,
        id: transaction.id,
      }));
      setTransactions(updatedTransactions);
      setApiResponse(null);
      setSelectedTransactions([]);
      setUploading(false);
      return response.data.result;
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDropdown1Change = (event) => {
    setDropdown1(event.target.value);
  };

  const handleDropdown2Change = (selectedOptions) => {
    setDropdown2(selectedOptions);
  };

  const selectOptions = userdata.map((item) => ({
    value: item.id,
    label: `${item.first_name} ${item.last_name || ""}`,
  }));

  return (
    <>
      <Header />
      <div>
        <form className="csv-upload-container" onSubmit={handleSubmit}>
          <h1 className="csv-upload-heading">CSV Upload</h1>
          <div className="flex items-center justify-center mb-4">
            <input
              type="file"
              id="csv-file-input"
              className="max-w-48 mx-2"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
            />
            <select
              id="dropdown1"
              value={dropdown1}
              className="max-w-72"
              onChange={handleDropdown1Change}
            >
              <option value="">Select a group</option>
              {data.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center mb-4">
            <label htmlFor="dropdown2" className="mx-2">
              Select Default Users:{" "}
            </label>
            <Select
              id="dropdown2"
              options={selectOptions}
              value={dropdown2}
              onChange={handleDropdown2Change}
              isMulti
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{ Option: CheckboxOption }}
              className="w-80"
            />
          </div>
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className={`w-half px-4 py-2 text-white rounded-2xl focus:outline-none focus:ring-2 flex items-center ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-400 hover:bg-indigo-600 focus:ring-indigo-400"
              }`}
              disabled={uploading}
            >
              Upload
            </button>
            {uploading && (
              <div className="m-4 w-2 h-2 spinner-container">
                <div className="orbit-spinner">
                  <div className="orbit"></div>
                  <div className="orbit"></div>
                  <div className="orbit"></div>
                </div>
              </div>
            )}
          </div>
        </form>
        <div className="flex justify-center">
          <TransactionsTable
            transactions={transactions}
            setTransactions={setTransactions}
            groups={data}
            users={selectOptions}
            apiResponse={apiResponse}
            setApiResponse={setApiResponse}
            selectedTransactions={selectedTransactions}
            setSelectedTransactions={setSelectedTransactions}
          />
        </div>
      </div>
    </>
  );
};

export default CSVUpload;

import React, { useState, useEffect } from "react";
import "./SingleTransactionUpload.css";
import api from "../api";
import config from "../config";
import Select, { components } from "react-select";
import Header from "./Header"; // Adjust the path based on your project structure

const SingleTransactionUpload = () => {
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState("");
  const [groupId, setGroupId] = useState("");
  const [users, setUsers] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [includeMyself, setIncludeMyself] = useState(true); // New state for checkbox [1/2
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupResponse = await api.get(config.groupApiUrl);
        setGroupData(groupResponse.data.result);

        const userResponse = await api.get(config.friendsApiUrl);
        setUserData(
          userResponse.data.result.map((user) => ({
            value: user.id,
            label: `${user.first_name} ${user.last_name || ""}`,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getGroupName = (groupId) => {
    console.log(groupData);
    const groupIdInt = parseInt(groupId, 10);
    const group = groupData.find((g) => g.id === groupIdInt);
    return group ? group.name : "Unknown Group";
  };

  const getUserNames = (userIds) => {
    return userIds
      .map((userId) => {
        const user = userData.find((u) => u.value === userId);
        return user ? user.label : "You";
      })
      .join(", ");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsError(false); // Reset error state on new submission
    setResponseMessage(""); // Reset response message
    setTransactionDetails(null); // Reset transaction details

    const payload = {
      title,
      cost,
      groupId,
      users: users.map((u) => u.value),
      include_self: includeMyself,
    };

    try {
      const response = await api.post(config.transactionUploadApiUrl, payload);
      if (response.data.result.success) {
        const detailedTransaction = {
          ...response.data.result.transaction,
          groupName: getGroupName(response.data.result.transaction.groupId),
          userNames: getUserNames(response.data.result.transaction.users),
        };
        setTransactionDetails(detailedTransaction);
        // After a successful transaction
        setResponseMessage("Transaction uploaded successfully!");
        setTimeout(() => {
          setResponseMessage("");
        }, 2000); // Hide the message after 2 seconds

        setTitle(""); // Reset title
        setCost(""); // Reset cost
      } else {
        setIsError(true);
        setResponseMessage("Error: " + response.data.result.description);
      }
    } catch (error) {
      setIsError(true);
      setResponseMessage("An error occurred while uploading the transaction.");
      console.error("Error uploading transaction:", error);
    }
  };
  const handleGroupChange = (event) => {
    const newGroupId = event.target.value;
    setGroupId(newGroupId);

    const selectedGroup = groupData.find(
      (group) => group.id === parseInt(newGroupId, 10)
    );
    if (selectedGroup && selectedGroup.members) {
      const memberIds = selectedGroup.members.map((member) => ({
        value: member.id,
        label: `${member.first_name} ${member.last_name || ""}`,
      }));
      setUsers(memberIds);
    } else {
      setUsers([]); // Clear users if no group is selected or if group has no members
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="w-full max-w-sm p-6 bg-white border border-gray-300 rounded-lg shadow-md">
          <form>
            <h2 class="mb-6 text-2xl font-bold text-center text-gray-700">
              Add Transaction
            </h2>

            <div class="flex space-x-4 w-full max-w-2xl mb-4">
              <div class="flex-1">
                <input
                  type="text"
                  id="title"
                  class="box"
                  placeholder="Title"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div class="flex-1">
                <input
                  type="text"
                  id="cost"
                  class="box"
                  placeholder="Cost"
                  onChange={(e) => setCost(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="group"
                className="block mb-2 text-left text-sm font-medium text-gray-600"
              >
                Group
              </label>
              <select
                id="group"
                value={groupId}
                onChange={handleGroupChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select a Group</option>
                {groupData.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="users"
                className="block mb-2 text-left text-sm font-medium text-gray-600"
              >
                Users
              </label>
              <Select
                id="users"
                options={userData}
                isMulti
                value={users}
                onChange={setUsers}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                components={{ DropdownIndicator: components.DropdownIndicator }}
              />
            </div>

            <div className="flex space-x-3">
              <label
                htmlFor="includedMyself"
                className="text-sm font-medium text-gray-600"
              >
                Include myself in this transaction
              </label>
              <input
                type="checkbox"
                id="includedMyself"
                checked={includeMyself}
                onChange={() => setIncludeMyself(!includeMyself)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="reset"
                className="w-half px-4 py-2 text-white bg-red-400 rounded-2xl hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Reset
              </button>
              <button
                type="submit"
                class="w-half px-4 py-2 text-white bg-green-400 rounded-2xl hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Add Transaction
              </button>
            </div>
            {responseMessage && (
              <div
                className={`response-message ${isError ? "error" : "success"}`}
              >
                {responseMessage}
              </div>
            )}
            {transactionDetails && !isError && (
              <div className="transaction-details">
                <h2>Transaction Details</h2>
                <p>Title: {transactionDetails.title}</p>
                <p>Cost: {transactionDetails.cost}</p>
                <p>Group ID: {transactionDetails.groupName}</p>
                <p>Users: {transactionDetails.userNames}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default SingleTransactionUpload;
/* 
<div className="single-transaction-upload-container">
      <div style={{display:'flex',flexDirection:'column', alignItems:'start'}}>
        <p style={{color:"#080e3d",fontSize:'14px'}}>Transactions</p>
      <h1 className="single-transaction-upload-heading">Add a new transaction</h1>
      <div style={{display:'flex',flexDirection:'row' ,width:'100%', justifyContent:'space-between'}}>
        <div style={{display:'flex',flexDirection:'row',marginBottom:'1rem'}}>
      <p>Fill the following details to add a transaction</p>
      
      </div>
      </div>
      
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="cost">Cost</label>
          <input
            type="number"
            id="cost"
            value={cost}
            onChange={e => setCost(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="group">Group</label>
          <select
            id="group"
            value={groupId}
            onChange={handleGroupChange}
          >
            <option value="">Select a Group</option>
            {groupData.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="users">Users:</label>
          <Select
            id="users"
            options={userData}
            isMulti
            value={users}
            onChange={setUsers}
            components={{ DropdownIndicator: components.DropdownIndicator }}
          />
        </div>
        <div className="form-group-inline">
          
          <label htmlFor="users">Include myself in this transaction {includeMyself}</label>
          <input
                  type="checkbox"
                  id="includedMyself"
                  checked={includeMyself}
                  onChange={() => setIncludeMyself(!includeMyself)}
                />
          
        </div>
        <div className="form-submit">
          <button type="reset" className="reset">Reset</button>
          <button type="submit" className="submit1">Add</button>
        </div>
        {responseMessage && (
          <div className={`response-message ${isError ? 'error' : 'success'}`}>
            {responseMessage}
          </div>
        )}
        {transactionDetails && !isError && (
          <div className="transaction-details">
            <h2>Transaction Details</h2>
            <p>Title: {transactionDetails.title}</p>
            <p>Cost: {transactionDetails.cost}</p>
            <p>Group ID: {transactionDetails.groupName}</p>
            <p>Users: {transactionDetails.userNames}</p>
          </div>
        )}
      </form>
    </div>
*/

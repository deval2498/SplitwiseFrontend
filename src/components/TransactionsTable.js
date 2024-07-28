import React, { useState } from "react";
import SwipeableCard from "./SwipeableCard";
import BulkExpenseResultTable from "./BulkExpenseResultTable";
import "./TransactionsTable.css";
import api from "../api";
import config from "../config";

function TransactionsTable({
  transactions,
  setTransactions,
  groups,
  users,
  apiResponse,
  setApiResponse,
  selectedTransactions,
  setSelectedTransactions,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState({});

  const handleSwipeLeft = () => {
    if (currentIndex < transactions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleAccept = (id) => {
    setTransactionStatus((prevStatus) => ({ ...prevStatus, [id]: "accepted" }));
    setSelectedTransactions((prevSelected) => [...prevSelected, id]);
    handleSwipeLeft();
  };

  const handleReject = (id) => {
    setTransactionStatus((prevStatus) => ({ ...prevStatus, [id]: "rejected" }));
    setSelectedTransactions((prevSelected) =>
      prevSelected.filter((transactionId) => transactionId !== id)
    );
    handleSwipeLeft();
  };

  function handleDescriptionChange(transactionId, newDescription) {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === transactionId
          ? { ...transaction, bank_transaction_desc: newDescription }
          : transaction
      )
    );
  }

  async function handleTransactionSubmit() {
    setIsLoading(true);

    try {
      const selected = transactions.filter((transaction) =>
        selectedTransactions.includes(transaction.id)
      );

      const transactionsToSubmit = selected.map((transaction) => ({
        transactionDetails: transaction,
        group: transaction.group,
        users: transaction.users.map((user) => user.value),
      }));

      const response = await api.post(config.createBulkTransactions, {
        transactions: transactionsToSubmit,
      });

      if (response.status === 200) {
        console.log("Transactions submitted successfully");
        setApiResponse(response.data.result);
      } else {
        console.error("Error submitting transactions");
      }
    } catch (error) {
      console.error("Error submitting transactions:", error);
    }
    setIsLoading(false);
  }

  function handleGroupChange(transactionId, newGroup) {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === transactionId
          ? { ...transaction, group: newGroup }
          : transaction
      )
    );
  }

  function handleUsersChange(transactionId, newUsers) {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === transactionId
          ? { ...transaction, users: newUsers }
          : transaction
      )
    );
  }

  return (
    <>
      {!apiResponse && (
        <div className="w-full max-w-sm p-6 bg-white border border-gray-300 rounded-lg shadow-md">
          {transactions.length > 0 && (
            <>
              {currentIndex === 0 && <div style={{ width: '50px' }} />}
              <SwipeableCard
                key={transactions[currentIndex].id}
                transaction={transactions[currentIndex]}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                handleDescriptionChange={handleDescriptionChange}
                handleGroupChange={handleGroupChange}
                handleUsersChange={handleUsersChange}
                handleAccept={handleAccept}
                handleReject={handleReject}
                groups={groups}
                users={users}
                status={transactionStatus[transactions[currentIndex].id]}
                showLeftButton={currentIndex > 0}
                showRightButton={currentIndex < transactions.length - 1}
              />
              {currentIndex === transactions.length - 1 && <div style={{ width: '50px' }} />}
              <button 
                className="w-24 h-12 rounded-2xl"
                onClick={handleTransactionSubmit} 
                disabled={isLoading}
              >
                Submit
              </button>
            </>
          )}
        </div>
      )}
      {apiResponse && (
        <BulkExpenseResultTable transactions={transactions} apiResponse={apiResponse} />
      )}
    </>
  );
}

export default TransactionsTable;

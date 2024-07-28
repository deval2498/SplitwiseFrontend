import React from "react";
import "./CSVUpload.css";

function BulkExpenseResultTable({ transactions, apiResponse }) {
  const successTransactions = apiResponse.success.map(
    (item) => item.transaction.transactionDetails.id
  );
  const errorTransactions = apiResponse.errors.reduce((acc, item) => {
    acc[item.transaction.transactionDetails.id] = item.errors;
    return acc;
  }, {});

  return (
    <div className="transactions-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Time</th>
            <th>Description</th>
            <th>Group</th>
            <th>Users</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            const isSuccess = successTransactions.includes(transaction.id);
            const isError = transaction.id in errorTransactions;

            return (
              <tr
                key={transaction.id}
                className={`transaction-row ${
                  isSuccess ? "success" : isError ? "error" : ""
                }`}
              >
                <td>{transaction.id}</td>
                <td>{transaction.transaction_amount}</td>
                <td>{transaction.bank_transaction_time}</td>
                <td>{transaction.bank_transaction_desc}</td>
                <td>{transaction.group}</td>
                <td>
                  {transaction.users
                    .map((user) => user.label)
                    .join(", ")}
                </td>
                <td>
                  {isError &&
                    Object.entries(errorTransactions[transaction.id]).map(
                      ([key, value]) => (
                        <div key={key}>
                          {key}: {value.join(", ")}
                        </div>
                      )
                    )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default BulkExpenseResultTable;


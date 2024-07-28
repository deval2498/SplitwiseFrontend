import React from "react";
import Select, { components } from "react-select";
import Checkbox from "@mui/material/Checkbox";
import "./TransactionCard.css";

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

const TransactionCard = ({
  transaction,
  groups,
  users,
  handleRowClick,
  handleDescriptionChange,
  handleGroupChange,
  handleUsersChange,
  isSelected,
}) => {
  const isExistingTransaction = transaction.existing_transaction;
  return (
    <div className={`transaction-card ${isExistingTransaction ? "blocked-row" : ""}`}>
      <div className="card-header">
        <h3>{transaction.transaction_amount}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            !isExistingTransaction && handleRowClick(transaction.id);
          }}
          disabled={isExistingTransaction}
        >
          {isSelected ? "Deselect" : "Select"}
        </button>
      </div>
      <div className="card-body">
        <p>{transaction.bank_transaction_time}</p>
        <p>{transaction.remark}</p>
        <input
          type="text"
          value={transaction.bank_transaction_desc}
          onChange={(event) =>
            !isExistingTransaction &&
            handleDescriptionChange(transaction.id, event.target.value)
          }
          disabled={isExistingTransaction}
        />
        <select
          value={transaction.group}
          onChange={(event) =>
            !isExistingTransaction &&
            handleGroupChange(transaction.id, event.target.value)
          }
          disabled={isExistingTransaction}
        >
          <option value="">Select an option</option>
          {groups.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <Select
          options={users}
          value={transaction.users}
          onChange={(selectedOptions) =>
            !isExistingTransaction &&
            handleUsersChange(transaction.id, selectedOptions)
          }
          isMulti
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          components={{ Option: CheckboxOption }}
          isDisabled={isExistingTransaction}
        />
      </div>
    </div>
  );
};

export default TransactionCard;
// SwipeableCard.js
import React from "react";
import { useSwipeable } from "react-swipeable";
import Select, { components } from "react-select";
import Checkbox from "@mui/material/Checkbox";
import "./SwipeableCard.css";

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

const SwipeableCard = ({
  transaction,
  onSwipeLeft,
  onSwipeRight,
  handleDescriptionChange,
  handleGroupChange,
  handleUsersChange,
  handleAccept,
  handleReject,
  groups,
  users,
  status,
  showLeftButton,
  showRightButton,
}) => {
  const isExistingTransaction = transaction.existing_transaction;

  const handlers = useSwipeable({
    onSwipedLeft: () => onSwipeLeft(transaction.id),
    onSwipedRight: () => onSwipeRight(transaction.id),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div className="swipeable-card-container" {...handlers}>
      {showLeftButton && (
        <button
          className="bg-black m-2 p-0 w-8 h-8"
          onClick={() => onSwipeRight(transaction.id)}
        >
          &#8592;
        </button>
      )}
      {!showLeftButton && <div className="m-2 w-8 h-8"></div>}
      <div
        className={`swipeable-card ${status} ${
          isExistingTransaction ? "blocked" : ""
        }`}
      >
        <div className="card-header">
          <h3>{transaction.transaction_amount}</h3>
          {status && (
            <span className={`status-indicator ${status}`}>{status}</span>
          )}
          {isExistingTransaction && (
            <span className="status-indicator existing">Already Added</span>
          )}
        </div>
        <div className="card-body">
          <p className="transaction-date">
            {new Date(transaction.bank_transaction_time).toLocaleString()}
          </p>
          <p className="transaction-remark">{transaction.remark}</p>
          <input
            type="text"
            value={transaction.bank_transaction_desc}
            onChange={(event) =>
              !isExistingTransaction &&
              handleDescriptionChange(transaction.id, event.target.value)
            }
            disabled={isExistingTransaction}
            placeholder="Transaction Description"
            className="border-box"
          />
          <select
            value={transaction.group}
            onChange={(event) =>
              !isExistingTransaction &&
              handleGroupChange(transaction.id, event.target.value)
            }
            disabled={isExistingTransaction}
          >
            <option value="">Select a group</option>
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
            placeholder="Select users"
          />
        </div>
        <div className="card-actions">
          <button
            className="action-button reject"
            onClick={() => handleReject(transaction.id)}
          >
            ✕
          </button>
          <button
            className="action-button accept"
            onClick={() => handleAccept(transaction.id)}
          >
            ✓
          </button>
        </div>
      </div>
      {showRightButton && (
        <button
          className="bg-black m-2 p-0 w-8 h-8"
          onClick={() => onSwipeLeft(transaction.id)}
        >
          &#8594;
        </button>
      )}
      {!showRightButton && <div className="m-2 w-8 h-8"></div>}
    </div>
  );
};

export default SwipeableCard;

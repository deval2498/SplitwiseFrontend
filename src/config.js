const config = {
  apiUrl: `${process.env.REACT_APP_API_HOST}/splitwise/auth/`,
  userApiUrl: `${process.env.REACT_APP_API_HOST}/splitwise/user_info/`,
  logoutUrl: `${process.env.REACT_APP_API_HOST}/splitwise/logout/`,
  groupApiUrl: `${process.env.REACT_APP_API_HOST}/splitwise/groups_info/`,
  friendsApiUrl: `${process.env.REACT_APP_API_HOST}/splitwise/friends_info/`,
  uploadApiUrl: `${process.env.REACT_APP_API_HOST}/splitwise/upload_csv/`,
  createBulkTransactions: `${process.env.REACT_APP_API_HOST}/splitwise/create_bulk_transactions/`,
  transactionUploadApiUrl: `${process.env.REACT_APP_API_HOST}/splitwise/create_single_transaction/`,
};

export default config;

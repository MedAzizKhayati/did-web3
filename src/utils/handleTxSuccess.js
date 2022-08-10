export default (dispatch, message = 'Transaction Successful') =>
  (tx) => {
    dispatch({
      type: 'success',
      message,
      title: 'Success',
      position: 'topR',
      icon: 'check'
    });
  };

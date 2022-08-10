export default (dispatch, message = 'An error has occured!') =>
  (err) => {
    dispatch({
      type: 'error',
      message: err?.error?.message?.split(':')?.[1] || message,
      title: 'Error',
      position: 'topR'
    });
  };

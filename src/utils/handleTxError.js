export default (dispatch, message = 'An error has occured!') =>
  (err) => {
    console.error(err);
    dispatch({
      type: 'error',
      message: err?.[0] || err?.error?.message?.split(':')?.[1] || message,
      title: 'Error',
      position: 'topR'
    });
  };

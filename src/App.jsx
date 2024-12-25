import React, { Fragment, useEffect } from "react";

// Redux Selector / Action
import { useDispatch } from "react-redux";

// import state selectors
import {
  setSetting
} from "./store/setting/actions";


function App({ children }) {
  const dispatch = useDispatch();

   // Use useEffect to dispatch the action only once when the component mounts
   useEffect(() => {
    dispatch(setSetting());
  }, [dispatch]);

  // dispatch(setSetting());
  return (
    <>
      <div className="App">
        {children}</div>
    </>
  )
}

export default App

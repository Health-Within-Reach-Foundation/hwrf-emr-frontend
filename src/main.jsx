// import { StrictMode } from 'react'
import React, { Fragment } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import "./assets/scss/xray.scss";
import "./assets/scss/custom.scss";
import "./assets/scss/rtl.scss";
import "./assets/scss/customizer.scss";

import "./assets/custom/custom.scss";
import "./assets/custom/_carousel.scss";
import "./assets/scss/antd/table.scss";
import "./assets/vendor/font-awesome/css/font-awesome.min.css";
import "./assets/vendor/remixicon/fonts/remixicon.css";
import "./assets/vendor/phosphor-icons/Fonts/regular/style.css";
import "./assets/vendor/phosphor-icons/Fonts/duotone/style.css";
import "./assets/vendor/phosphor-icons/Fonts/fill/style.css";

//router
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// page
import { LayoutsRoute } from "./router/layout-router";
import { Toaster } from "react-hot-toast";

// store
import { store } from "./store/index";
import { Provider } from "react-redux";

import AuthProvider from "./utilities/AuthProvider";

const router = createBrowserRouter([...LayoutsRoute], {
  basename: import.meta.env.BASE_URL,
  future: {
    v7_relativeSplatPath: true, // Enables relative paths in nested routes
    v7_fetcherPersist: true, // Retains fetcher state during navigation
    v7_normalizeFormMethod: true, // Normalizes form methods (e.g., POST or GET)
    v7_partialHydration: true, // Supports partial hydration for server-side rendering
    v7_skipActionErrorRevalidation: true, // Prevents revalidation when action errors occur
  },
});

createRoot(document.getElementById("root")).render(
  // <React.StrictMode>

  <Fragment>
    <Provider store={store}>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{ duration: 3000 }}
        />
        <AuthProvider>
          <App>
            <RouterProvider
              router={router}
              future={{ v7_startTransition: true }}
            ></RouterProvider>
          </App>
        </AuthProvider>
    </Provider>
  </Fragment>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

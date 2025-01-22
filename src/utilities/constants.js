const adminiStartionItems = [
  {
    path: "/administration/users-list",
    name: "All Users",
    icon: "ri-file-list-fill",
  },
  {
    path: "/administration/add-user",
    name: "Add User",
    icon: "ri-user-add-fill",
  },
  {
    path:"/administration/roles",
    name:"Roles",
    icon:"ri-user-settings-fill"
  },
  // {
  //   path:"/administration/form-templates",
  //   name:"Form Templates",
  //   icon:"ri-user-settings-fill"
  // },
];

const emailItems = [
  { path: "/email/inbox", name: "Inbox", icon: "ri-inbox-fill" },
  {
    path: "/email/email-compose",
    name: "Email Compose",
    icon: "ri-edit-2-fill",
  },
];

const doctorItems = [
  {
    path: "/doctor/doctor-list",
    name: "All Doctor",
    icon: "ri-file-list-fill",
  },
  {
    path: "/doctor/add-doctor",
    name: "Add Doctor",
    icon: "ri-user-add-fill",
  },
  {
    path: "/doctor/doctor-profile",
    name: "Doctor Profile",
    icon: "ri-profile-fill",
  },
  {
    path: "/doctor/edit-doctor",
    name: "Edit Doctor",
    icon: "ri-file-edit-fill",
  },
];

const patientItems = [
  {
    path: "/patient/patient-list",
    name: "All Patient",
    icon: "ri-file-list-fill",
  },
  {
    path: "/patient/add-patient",
    name: "Add Patient",
    icon: "ri-user-add-fill",
  },
  // {
  //   path: "/patient/patient-profile",
  //   name: "Patient Profile",
  //   icon: "ri-profile-fill",
  // },
  // {
  //   path: "/patient/edit-patient",
  //   name: "Edit Patient",
  //   icon: "ri-file-edit-fill",
  // },
];

const uiElementsItems = [
  { path: "/ui-elements/colors", name: "Colors", icon: "ri-font-color" },
  { path: "/ui-elements/typography", name: "Typography", icon: "ri-text" },
  { path: "/ui-elements/alerts", name: "Alerts", icon: "ri-alert-fill" },
  { path: "/ui-elements/badges", name: "Badges", icon: "ri-building-3-fill" },
  {
    path: "/ui-elements/breadcrumb",
    name: "Breadcrumb",
    icon: "ri-guide-fill",
  },
  {
    path: "/ui-elements/buttons",
    name: "Buttons",
    icon: "ri-checkbox-blank-fill",
  },
  { path: "/ui-elements/cards", name: "Cards", icon: "ri-bank-card-fill" },
  {
    path: "/ui-elements/carousel",
    name: "Carousel",
    icon: "ri-slideshow-4-fill",
  },
  { path: "/ui-elements/video", name: "Video", icon: "ri-movie-fill" },
  { path: "/ui-elements/grid", name: "Grid", icon: "ri-grid-fill" },
  { path: "/ui-elements/images", name: "Images", icon: "ri-image-fill" },
  {
    path: "/ui-elements/list-group",
    name: "List Group",
    icon: "ri-file-list-fill",
  },
  {
    path: "/ui-elements/modal",
    name: "Modal",
    icon: "ri-checkbox-blank-fill",
  },
  {
    path: "/ui-elements/notifications",
    name: "Notifications",
    icon: "ri-notification-3-fill",
  },
  {
    path: "/ui-elements/pagination",
    name: "Pagination",
    icon: "ri-more-fill",
  },
  {
    path: "/ui-elements/popovers",
    name: "Popovers",
    icon: "ri-folder-shield-fill",
  },
  {
    path: "/ui-elements/progressbars",
    name: "Progressbars",
    icon: "ri-battery-low-fill",
  },
  { path: "/ui-elements/tabs", name: "Tabs", icon: "ri-database-fill" },
  {
    path: "/ui-elements/tooltips",
    name: "Tooltips",
    icon: "ri-record-mail-fill",
  },
];

const formItems = [
  {
    path: "/forms/form-elements",
    name: "Form Elements",
    icon: "ri-tablet-fill",
  },
  {
    path: "/forms/form-validations",
    name: "Form Validation",
    icon: "ri-device-fill",
  },
  { path: "/forms/form-switch", name: "Form Switch", icon: "ri-toggle-fill" },
  {
    path: "/forms/form-checkbox",
    name: "Form Checkbox",
    icon: "ri-chat-check-fill",
  },
  {
    path: "/forms/form-radio",
    name: "Form Radio",
    icon: "ri-radio-button-fill",
  },
];

const formWizardItems = [
  {
    path: "/wizard/simple-wizard",
    name: "Simple Wizard",
    icon: "ri-anticlockwise-fill",
  },
  {
    path: "/wizard/validate-wizard",
    name: "Validate Wizard",
    icon: "ri-anticlockwise-2-fill",
  },
  {
    path: "/wizard/vertical-wizard",
    name: "Vertical Wizard",
    icon: "ri-clockwise-fill",
  },
];

const tableItems = [
  {
    path: "/tables/basic-table",
    name: "Basic Tables",
    icon: "ri-table-fill",
  },
  { path: "/tables/data-table", name: "Data Tables", icon: "ri-table-2" },
  {
    path: "/tables/editable-table",
    name: "Editable Tables",
    icon: "ri-archive-drawer-fill",
  },
];

const chartItems = [
  {
    path: "/charts/chart-page",
    name: "Chart Page",
    icon: "ri-file-chart-fill",
  },
  { path: "/charts/e-chart", name: "ECharts", icon: "ri-bar-chart-fill" },
  {
    path: "/charts/chart-am",
    name: "Am Charts",
    icon: "ri-bar-chart-box-fill",
  },
  {
    path: "/charts/apex-chart",
    name: "Apex Chart",
    icon: "ri-bar-chart-box-fill",
  },
];

const iconItems = [
  { path: "/icons/dripicons", name: "Dripicons", icon: "ri-stack-fill" },
  {
    path: "/icons/fontawesome-5",
    name: "Font Awesome 5",
    icon: "ri-facebook-fill",
  },
  {
    path: "/icons/line-awesome",
    name: "Line Awesome",
    icon: "ri-keynote-fill",
  },
  { path: "/icons/remixicon", name: "Remixicon", icon: "ri-remixicon-fill" },
  { path: "/icons/unicons", name: "Unicons", icon: "ri-underline" },
];

const authItems = [
  { path: "/auth/sign-in", name: "Login", icon: "ri-login-box-fill" },
  { path: "/auth/sign-up", name: "Register", icon: "ri-logout-box-fill" },
  {
    path: "/auth/recover-password",
    name: "Recover Password",
    icon: "ri-record-mail-fill",
  },
  {
    path: "/auth/confirm-mail",
    name: "Confirm Mail",
    icon: "ri-chat-check-fill",
  },
  {
    path: "/auth/lock-screen",
    name: "Lock Screen",
    icon: "ri-file-lock-fill",
  },
];

const extraPagesItems = [
  {
    path: "/extra-pages/pages-timeline",
    name: "Timeline",
    icon: "ri-map-pin-time-fill",
  },
  {
    path: "/extra-pages/pages-invoice",
    name: "Invoice",
    icon: "ri-question-answer-fill",
  },
  {
    path: "/extra-pages/blank-page",
    name: "Blank Page",
    icon: "ri-checkbox-blank-fill",
  },
  {
    path: "/extra-pages/pages-error-404",
    name: "Error 404",
    icon: "ri-error-warning-fill",
  },
  {
    path: "/extra-pages/pages-error-500",
    name: "Error 500",
    icon: "ri-error-warning-fill",
  },
  {
    path: "/extra-pages/pages-pricing",
    name: "Pricing",
    icon: "ri-price-tag-3-fill",
  },
  {
    path: "/extra-pages/pages-pricing-one",
    name: "Pricing 1",
    icon: "ri-price-tag-2-fill",
  },
  {
    path: "/extra-pages/pages-maintenance",
    name: "Maintenance",
    icon: "ri-git-repository-commits-fill",
  },
  {
    path: "/extra-pages/pages-comingsoon",
    name: "Coming Soon",
    icon: "ri-run-fill",
  },
  {
    path: "/extra-pages/pages-faq",
    name: "Faq",
    icon: "ri-compasses-2-fill",
  },
];

export {
  emailItems,
  doctorItems,
  patientItems,
  uiElementsItems,
  formItems,
  formWizardItems,
  tableItems,
  chartItems,
  iconItems,
  authItems,
  extraPagesItems,
  adminiStartionItems,
};

// import React, { useEffect } from "react";
// import ReactDOM from "react-dom"; // For rendering JSX in table cells
// import $ from "jquery";
// import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
// import "datatables.net-bs5";

// const newUseDataTable = ({
//   tableRef,
//   columns,
//   data = [],
//   url = null,
//   actionCallback,
//   globalSearchEnabled = true,
//   filters = [],
//   rowOnClick = null, // Pass row click handler
// }) => {
//   useEffect(() => {
//     setTimeout(() => {
//       let datatableObj = {
//         dom: globalSearchEnabled
//           ? '<"row align-items-center"<"col-md-6" l><"col-md-6" f>><"table-responsive" rt><"row align-items-center"<"col-md-6" i><"col-md-6" p>><"clear">'
//           : '<"table-responsive" rt><"row align-items-center"<"col-md-6" i><"col-md-6" p>><"clear">',
//         autoWidth: false,
//         columns: columns,
//         destroy: true,
//         columnDefs: [
//           {
//             targets: columns
//               .map((col, index) => (col.render ? index : -1)) // Only include columns with a render function
//               .filter((index) => index !== -1), // Filter out -1 values that are not relevant
//             createdCell: (cell, cellData, rowData, rowIndex, colIndex) => {
//               console.log("cellData, cell, rowData, rowIndex, colIndex", cellData, cell, rowData, rowIndex, colIndex);
//               const column = columns[colIndex];
//               const renderFunction = column.render;

//               if (renderFunction) {
//                 // Render JSX or any complex value
//                 const renderedContent = renderFunction(cellData, rowData, rowIndex, colIndex);

//                 // Render the JSX content inside the cell (using ReactDOM)
//                 if (React.isValidElement(renderedContent)) {
//                   ReactDOM.render(renderedContent, cell);
//                 } else {
//                   // If it's not JSX (but still something renderable), fallback to string
//                   $(cell).html(renderedContent);
//                 }
//               } else {
//                 // Default DataTable behavior for columns without render
//                 $(cell).html(cellData);
//               }
//             },
//           },
//         ],
//       };

//       if (url) {
//         datatableObj = {
//           ...datatableObj,
//           processing: true,
//           serverSide: true,
//           ajax: { url },
//         };
//       } else {
//         datatableObj = {
//           ...datatableObj,
//           data,
//         };
//       }

//       const datatable = $(tableRef.current).DataTable(datatableObj);

//       // Handle row click handler if provided
//       if (rowOnClick) {
//         $(datatable.table().body()).on("click", "tr", function () {
//           const rowData = datatable.row(this).data();
//           rowOnClick(rowData); // Call the row click handler with row data
//         });
//       }

//       // Handle filters if provided
//       if (filters.length > 0) {
//         filters.forEach((filter) => {
//           const filterColumnIndex = columns.findIndex(
//             (col) => col.data === filter.key
//           );
//           if (filterColumnIndex !== -1) {
//             $(`#filter-${filter.key}`).on("change", function () {
//               datatable.column(filterColumnIndex).search(this.value).draw();
//             });
//           }
//         });
//       }

//       // Ensure action callback is handled if available
//       if (typeof actionCallback === "function") {
//         $(datatable.table().body()).on(
//           "click",
//           '[data-table="action"]',
//           function () {
//             actionCallback({
//               id: $(this).data("id"),
//               method: $(this).data("method"),
//             });
//           }
//         );
//       }
//     }, 0);

//     return () => {
//       if ($.fn.DataTable.isDataTable(tableRef.current)) {
//         $(tableRef.current).DataTable().destroy();
//       }
//       $(tableRef.current).empty();
//     };
//   }, [
//     tableRef,
//     columns,
//     data,
//     url,
//     actionCallback,
//     filters,
//     globalSearchEnabled,
//     rowOnClick,
//   ]);
// };

// export default newUseDataTable;
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client"; // Use createRoot from React 18
import $ from "jquery";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-bs5";

const newUseDataTable = ({
  tableRef,
  columns,
  data = [],
  url = null,
  actionCallback,
  globalSearchEnabled = true,
  filters = [],
  rowOnClick = null, // Pass row click handler
}) => {
  useEffect(() => {
    setTimeout(() => {
      let datatableObj = {
        dom: globalSearchEnabled
          ? '<"row align-items-center"<"col-md-6" l><"col-md-6" f>><"table-responsive" rt><"row align-items-center"<"col-md-6" i><"col-md-6" p>><"clear">'
          : '<"table-responsive" rt><"row align-items-center"<"col-md-6" i><"col-md-6" p>><"clear">',
        autoWidth: false,
        columns: columns,
        destroy: true,
        columnDefs: [
          {
            targets: columns
              .map((col, index) => (col.render ? index : -1)) // Only include columns with a render function
              .filter((index) => index !== -1), // Filter out -1 values that are not relevant
            // createdCell: (cell, cellData, rowData, rowIndex, colIndex) => {
            //   // console.log("cellData, cell, rowData, rowIndex, colIndex", cellData, cell, rowData, rowIndex, colIndex);
            //   const column = columns[colIndex];
            //   const renderFunction = column.render;

            //   if (renderFunction) {
            //     // Render JSX or any complex value
            //     const renderedContent = renderFunction(cellData, rowData, rowIndex, colIndex);

            //     // Render the JSX content inside the cell (using ReactDOM.createRoot)
            //     if (React.isValidElement(renderedContent)) {
            //       // Create root to render JSX
            //       const root = ReactDOM.createRoot(cell);
            //       root.render(renderedContent);
            //     } else {
            //       // If it's not JSX (but still something renderable), fallback to string
            //       $(cell).html(renderedContent);
            //     }
            //   } else {
            //     // Default DataTable behavior for columns without render
            //     $(cell).html(cellData);
            //   }
            // },
            createdCell: (cell, cellData, rowData, rowIndex, colIndex) => {
              const column = columns[colIndex];
              const renderFunction = column.render;

              if (renderFunction) {
                const renderedContent = renderFunction(
                  cellData,
                  rowData,
                  rowIndex,
                  colIndex
                );
                if (React.isValidElement(renderedContent)) {
                  const root = ReactDOM.createRoot(cell);
                  root.render(renderedContent);
                } else {
                  $(cell).html(renderedContent);
                }
              } else {
                $(cell).html(cellData);
              }
            },
          },
        ],
      };

      if (url) {
        datatableObj = {
          ...datatableObj,
          processing: true,
          serverSide: true,
          ajax: { url },
        };
      } else {
        datatableObj = {
          ...datatableObj,
          data,
        };
      }

      const datatable = $(tableRef.current).DataTable(datatableObj);

      // Handle row click handler if provided
      if (rowOnClick) {
        $(datatable.table().body()).on("click", "tr", function () {
          const rowData = datatable.row(this).data();
          rowOnClick(rowData); // Call the row click handler with row data
        });
      }

      // Handle filters if provided
      if (filters.length > 0) {
        filters.forEach((filter) => {
          const filterColumnIndex = columns.findIndex(
            (col) => col.data === filter.key
          );
          if (filterColumnIndex !== -1) {
            $(`#filter-${filter.key}`).on("change", function () {
              datatable.column(filterColumnIndex).search(this.value).draw();
            });
          }
        });
      }

      // Ensure action callback is handled if available
      if (typeof actionCallback === "function") {
        $(datatable.table().body()).on(
          "click",
          '[data-table="action"]',
          function () {
            actionCallback({
              id: $(this).data("id"),
              method: $(this).data("method"),
            });
          }
        );
      }
    }, 0);

    return () => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
      $(tableRef.current).empty();
    };
  }, [
    tableRef,
    columns,
    data,
    url,
    actionCallback,
    filters,
    globalSearchEnabled,
    rowOnClick,
  ]);
};

export default newUseDataTable;

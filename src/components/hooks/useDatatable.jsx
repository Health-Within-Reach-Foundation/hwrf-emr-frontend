// import { useEffect } from "react";
// import $ from "jquery";
// import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
// import "datatables.net-bs5";

// const useDataTable = ({
//   tableRef,
//   columns,
//   data = [],
//   url = null,
//   actionCallback,
//   isColumnHidden = false,
//   isColumnHiddenClass = ".toggle-vis",
//   isFilterColumn = false,
//   isFooter = false,
//   isMultilang = false,
// }) => {
//   useEffect(() => {
//     setTimeout(() => {
//       let datatableObj = {
//         dom: '<"row align-items-center"<"col-md-6" l><"col-md-6" f>><"table-responsive" rt><"row align-items-center" <"col-md-6" i><"col-md-6" p>><"clear">',
//         autoWidth: false,
//         columns: columns,
//         destroy: true,
//       };

//       if (url) {
//         datatableObj = {
//           ...datatableObj,
//           processing: true,
//           serverSide: true,
//           ajax: {
//             url: url,
//           },
//         };
//       }

//       if (data) {
//         datatableObj = {
//           ...datatableObj,
//           data: data,
//         };
//       }

//       if (isFooter) {
//         datatableObj = {
//           ...datatableObj,
//           initComplete: function () {
//             const footerRow = document.createElement("tr");
//             columns.forEach((column) => {
//               const footerCell = document.createElement("th");
//               footerCell.append(column.title);
//               footerRow.append(footerCell);
//             });

//             $(tableRef.current).append($("<tfoot>").append(footerRow));
//           },
//         };
//       }
//       if (isFilterColumn) {
//         datatableObj = {
//           ...datatableObj,
//           initComplete: function () {
//             const footerRow = document.createElement("tr");
//             const table = $(tableRef.current).DataTable();
//             columns.forEach((column) => {
//               const footerCell = document.createElement("td");
//               const input = document.createElement("input");
//               input.type = "text";
//               input.className = "form-control form-control-sm";
//               input.placeholder = column.title;
//               input.addEventListener("keyup", (event) => {
//                 const columnIndex = columns.findIndex(
//                   (c) => c.title === column.title
//                 );
//                 table.columns(columnIndex).search(event.target.value).draw();
//               });
//               footerCell.append(input);
//               footerRow.append(footerCell);
//             });

//             $(tableRef.current).append($("<tfoot>").append(footerRow));
//           },
//         };
//       }

//       function languageSelect() {
//         if (tableRef.current) {
//           return Array.from(document.querySelector("#langSelector").options)
//             .filter((option) => option.selected)
//             .map((option) => option.getAttribute("data-path"));
//         }
//       }

//       const setMultiLang = () => {
//         datatableObj = {
//           ...datatableObj,
//           language: {
//             url: languageSelect(),
//           },
//         };
//       };
//       if (isMultilang) {
//         setMultiLang();
//       } 
//       let datatable = $(tableRef.current).DataTable(datatableObj);

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

//       if (isColumnHidden) {
//         $(isColumnHiddenClass).on("click", function (e) {
//           e.preventDefault();
//           const column = datatable.column($(this).attr("data-column"));
//           column.visible(!column.visible());
//         });
//       }

//       if (isMultilang) {
//         document
//           .querySelector("#langSelector")
//           .addEventListener("change", () => {
//             $(tableRef.current).DataTable().destroy();
//             setMultiLang();
//             datatable = $(tableRef.current).DataTable(datatableObj);
//           });
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
//     isColumnHidden,
//     isColumnHiddenClass,
//     isFilterColumn,
//     isFooter,
//     isMultilang,
//   ]);
// };

// export default useDataTable;


import { useEffect } from "react";
import $ from "jquery";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-bs5";

const useDataTable = ({
  tableRef,
  columns,
  data = [],
  url = null,
  actionCallback,
  isColumnHidden = false,
  isColumnHiddenClass = ".toggle-vis",
  isFilterColumn = false,
  isFooter = false,
  isMultilang = false,
}) => {
  useEffect(() => {
    setTimeout(() => {
      let datatableObj = {
        dom: '<"row align-items-center"<"col-md-6" l><"col-md-6" f>><"table-responsive" rt><"row align-items-center" <"col-md-6" i><"col-md-6" p>><"clear">',
        autoWidth: false,
        columns: columns,
        destroy: true,
        createdRow: function (row, data) {
          // Highlight the "status" column based on its value
          const statusIndex = columns.findIndex((col) => col.data === "status");
          if (statusIndex >= 0) {
            const statusCell = row.children[statusIndex];
            const status = data.status.toLowerCase();
            statusCell.classList.add("status-cell");
            if (status === "active") statusCell.classList.add("table-success");
            if (status === "pending") statusCell.classList.add("table-info");
            if (status === "inactive") statusCell.classList.add("table-danger");
          }
        },
      };

      if (url) {
        datatableObj = {
          ...datatableObj,
          processing: true,
          serverSide: true,
          ajax: { url },
        };
      }

      if (data) {
        datatableObj = {
          ...datatableObj,
          data,
        };
      }

      if (isFooter) {
        datatableObj = {
          ...datatableObj,
          initComplete: function () {
            const footerRow = document.createElement("tr");
            columns.forEach((column) => {
              const footerCell = document.createElement("th");
              footerCell.append(column.title);
              footerRow.append(footerCell);
            });

            $(tableRef.current).append($("<tfoot>").append(footerRow));
          },
        };
      }

      if (isFilterColumn) {
        datatableObj = {
          ...datatableObj,
          initComplete: function () {
            const footerRow = document.createElement("tr");
            const table = $(tableRef.current).DataTable();
            columns.forEach((column) => {
              const footerCell = document.createElement("td");
              const input = document.createElement("input");
              input.type = "text";
              input.className = "form-control form-control-sm";
              input.placeholder = column.title;
              input.addEventListener("keyup", (event) => {
                const columnIndex = columns.findIndex(
                  (c) => c.title === column.title
                );
                table.columns(columnIndex).search(event.target.value).draw();
              });
              footerCell.append(input);
              footerRow.append(footerCell);
            });

            $(tableRef.current).append($("<tfoot>").append(footerRow));
          },
        };
      }

      let datatable = $(tableRef.current).DataTable(datatableObj);

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

      if (isColumnHidden) {
        $(isColumnHiddenClass).on("click", function (e) {
          e.preventDefault();
          const column = datatable.column($(this).attr("data-column"));
          column.visible(!column.visible());
        });
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
    isColumnHidden,
    isColumnHiddenClass,
    isFilterColumn,
    isFooter,
    isMultilang,
  ]);
};

export default useDataTable;


import { useEffect } from "react";
import $ from "jquery";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-bs5";

const newUseDataTable = ({
  tableRef,
  columns,
  data = [],
  url = null,
  actionCallback,
  globalSearchEnabled = true, // Enable/disable global search
  filters = [], // Array of filter configurations
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

      if (filters.length > 0) {
        filters.forEach((filter) => {
          const filterColumnIndex = columns.findIndex((col) => col.data === filter.key);
          if (filterColumnIndex !== -1) {
            $(`#filter-${filter.key}`).on("change", function () {
              datatable.column(filterColumnIndex).search(this.value).draw();
            });
          }
        });
      }

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
  }, [tableRef, columns, data, url, actionCallback, filters, globalSearchEnabled]);
};

export default newUseDataTable;

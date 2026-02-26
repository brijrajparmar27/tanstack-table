import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Table({
  data,
  sort,
  setSort,
  pagination,
  setPagination,
  filter,
  setFilter,
}) {
  const colHelper = createColumnHelper();
  const columns = [
    colHelper.accessor("name", {
      header: "Name",
    }),
    colHelper.accessor("email", {
      header: "Email Add.",
    }),
    colHelper.accessor("age", {
      header: "Age",
    }),
  ];

  console.log(data.pagination.totalPages);

  const table = useReactTable({
    data: data.data,
    columns,
    state: {
      sorting: sort,
      pagination: pagination,
      globalFilter: filter,
    },
    manualPagination: true,
    manualFiltering: true,
    pageCount: data.pagination.totalPages,
    onSortingChange: setSort,
    onGlobalFilterChange: setFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="table-content">
      <div className="searchbox">
        <input
          type="text"
          value={table.getState().globalFilter}
          onChange={(e) => table.setGlobalFilter(e.target.value.trim())}
        />
      </div>
      <div className="table-container">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}{" "}
                        {
                          {
                            asc: <ChevronUp size={12} />,
                            desc: <ChevronDown size={12} />,
                          }[header.column.getIsSorted()]
                        }
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((rowModel) => {
              return (
                <tr key={rowModel.id}>
                  {rowModel.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="footer">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <div className="page-size-selector">
          <p>Page Size: </p>{" "}
          <select
            name="page-size"
            id=""
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 50, 100, 500].map((each) => {
              return (
                <option value={each} key={each}>
                  {each}
                </option>
              );
            })}
          </select>
        </div>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
}

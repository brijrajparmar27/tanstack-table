import { useEffect, useState } from "react";
import "./App.css";
import axios from "./axios";
import Table from "./Table";

function App() {
  const [data, setData] = useState({});
  const [sort, setSort] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 500,
  });

  console.log(pagination);

  function getSortParams() {
    if (!sort.length) return {};
    return `${sort[0].id}:${sort[0].desc ? "desc" : "asc"}`;
  }

  function getPage() {
    return pagination.pageIndex + 1;
  }

  function getLimit() {
    return pagination.pageSize;
  }

  function getGlobalFilter() {
    return globalFilter;
  }

  function getStudents() {
    axios
      .get("/users", {
        params: {
          sort: getSortParams(),
          page: getPage(),
          limit: getLimit(),
          search: getGlobalFilter(),
        },
      })
      .then(({ data }) => {
        console.log(data);

        setData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    getStudents();
  }, [sort, pagination, globalFilter]);

  return (
    <div className="main">
      {data?.count && (
        <Table
          data={data}
          sort={sort}
          setSort={setSort}
          pagination={pagination}
          setPagination={setPagination}
          filter={globalFilter}
          setFilter={setGlobalFilter}
        />
      )}
    </div>
  );
}

export default App;

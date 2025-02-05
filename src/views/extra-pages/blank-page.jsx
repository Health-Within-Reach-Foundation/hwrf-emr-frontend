import React from "react";
import Antdtable from "../../components/antd-table";
import { Link } from "react-router-dom";
import { Badge } from "antd";

const columns = [
  { title: "ID", dataIndex: "id", key: "id", sortable: true },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sortable: true,
    render: (text, record) => <Link to={`/profile/${record.id}`}>{text}</Link>,
  },
  { title: "Age", dataIndex: "age", key: "age", sortable: true },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
  },
];

const data = [
    { key: 2, id: 2, name: "Jane Smith", age: 25, status: "warning" },
    { key: 3, id: 3, name: "John Doe", age: 30, status: "success" },
    { key: 4, id: 4, name: "Alice Johnson", age: 28, status: "error" },
    { key: 5, id: 5, name: "Bob Brown", age: 22, status: "success" },
    { key: 6, id: 6, name: "Charlie Davis", age: 35, status: "warning" },
    { key: 7, id: 7, name: "Diana Lee", age: 40, status: "error" },
    { key: 8, id: 8, name: "Eva Adams", age: 31, status: "success" },
    { key: 9, id: 9, name: "Frank Harris", age: 27, status: "warning" },
    { key: 10, id: 10, name: "Grace Williams", age: 33, status: "error" },
    { key: 11, id: 11, name: "Henry Miller", age: 38, status: "success" },
    { key: 12, id: 12, name: "Ivy Martinez", age: 26, status: "error" },
    { key: 13, id: 13, name: "Jack Wilson", age: 29, status: "warning" },
    { key: 14, id: 14, name: "Kelly Moore", age: 34, status: "success" },
    { key: 15, id: 15, name: "Leo Taylor", age: 23, status: "error" },
    { key: 16, id: 16, name: "Mona Jackson", age: 37, status: "warning" },
    { key: 17, id: 17, name: "Nathan Scott", age: 32, status: "success" },
    { key: 18, id: 18, name: "Olivia Clark", age: 26, status: "error" },
    { key: 19, id: 19, name: "Paul Harris", age: 29, status: "warning" },
    { key: 20, id: 20, name: "Quincy Lewis", age: 40, status: "success" },
    { key: 21, id: 21, name: "Rita Walker", age: 24, status: "error" },
    { key: 22, id: 22, name: "Sam Adams", age: 30, status: "warning" },
    { key: 23, id: 23, name: "Tina Evans", age: 28, status: "success" },
    { key: 24, id: 24, name: "Ursula Allen", age: 32, status: "error" },
    { key: 25, id: 25, name: "Victor King", age: 34, status: "warning" },
    { key: 26, id: 26, name: "Wendy Thompson", age: 36, status: "success" },
    { key: 27, id: 27, name: "Xander Lopez", age: 25, status: "error" },
    { key: 28, id: 28, name: "Yara Harris", age: 31, status: "warning" },
    { key: 29, id: 29, name: "Zane Young", age: 33, status: "success" },
    { key: 30, id: 30, name: "Angela Turner", age: 28, status: "error" },
    { key: 31, id: 31, name: "Brian Smith", age: 29, status: "warning" },
    { key: 32, id: 32, name: "Catherine White", age: 32, status: "success" },
    { key: 33, id: 33, name: "Derek Campbell", age: 27, status: "error" },
    { key: 34, id: 34, name: "Emily Harris", age: 29, status: "warning" },
    { key: 35, id: 35, name: "Felix Wright", age: 36, status: "success" },
    { key: 36, id: 36, name: "Gina Martin", age: 31, status: "error" },
  ];
  

const BlankPage = () => {
  return (
    <>
      Here Add Your React Content.....
      // pass the page size options
      <Antdtable columns={columns} data={data} pageSizeOptions={[2,50,200]} defaultPageSize={10}/>;
    </>
  );
};

export default BlankPage;

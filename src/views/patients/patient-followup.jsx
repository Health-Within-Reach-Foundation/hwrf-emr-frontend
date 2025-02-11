import React, { useEffect, useState } from "react";
import patientServices from "../../api/patient-services";
import { Loading } from "../../components/loading";
import AntdTable from "../../components/antd-table";

const PatientFollowUp = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      title: "Reg No",
      dataIndex: "regNo",
      key: "regNo",
      sortable: true,
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sortable: true,
      width: 100,
    },
    { title: "Age", dataIndex: "age", key: "age", sortable: true, width: 100 },
    { title: "Sex", dataIndex: "sex", key: "sex", sortable: true, width: 100 },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      sortable: true,
      width: 100,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      sortable: true,
      width: 100,
    },
    // {
    //   title: "Next Follow-Up Date",
    //   dataIndex: "nextFollowUpDate",
    //   key: "nextFollowUpDate",
    //   sortable: true,
    //   width: 100,
    //   render: (text, record) => <DateCell date={date} />,
    // },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
      sortable: true,
      width: 100,
    },
  ];
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await patientServices.getPatientsFollowUps(); // Replace with your API endpoint
      console.log("Patient follow-ups:", response.data);
      if (response.success) {
        setPatients(response.data);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>Upcoming Patient Follow-Ups</h1>

      <AntdTable
        columns={columns}
        data={patients}
        defaultPageSize={50}
        pageSizeOptions={[50, 100, 150, 200]}
      />
    </div>
  );
};

export default PatientFollowUp;

import React from "react";
import { useQuery, gql } from "@apollo/client";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Legend,
  Tooltip,
  CartesianGrid,
} from "recharts";
import "./HomePage.css";

const ENTITY_COUNTS = gql`
  query {
    entityCounts {
      universities
      departments
      specializations
      students
    }
  }
`;

const STUDENTS_BY_UNIVERSITY = gql`
  query {
    studentCountsByUniversity {
      universityName
      studentCount
    }
  }
`;

const STUDENTS_BY_SPECIALIZATION = gql`
  query {
    studentCountsBySpecializationWithDeptAndUniversity {
      specializationName
      departmentName
      universityName
      studentCount
    }
  }
`;

const STUDENTS_BY_DEPARTMENT = gql`
  query {
    studentCountsByDepartmentWithUniversity {
      universityName
      departmentName
      studentCount
    }
  }
`;

const HomePage: React.FC = () => {
  const { data: entityData } = useQuery(ENTITY_COUNTS);
  const { data: universityData } = useQuery(STUDENTS_BY_UNIVERSITY);
  const { data: departmentData } = useQuery(STUDENTS_BY_DEPARTMENT);
  const { data: specializationData } = useQuery(STUDENTS_BY_SPECIALIZATION);

  return (
    <div className="homePage">
      <div className="contain">
        <p>
          Welcome to the Student Information Dashboard, a centralized platform
          for viewing and manipulating student data across academic structures,
          providing a comprehensive overview and management of student records.
        </p>

        <div className="chart-section">
          <div className="firstline">
            <div className="entity-counts-table-container">
              <h5>Entity Overview</h5>
              <table className="entity-counts-table">
                <thead>
                  <tr>
                    <th>Entity</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Universities</td>
                    <td>{entityData?.entityCounts.universities}</td>
                  </tr>
                  <tr>
                    <td>Departments</td>
                    <td>{entityData?.entityCounts.departments}</td>
                  </tr>
                  <tr>
                    <td>Specializations</td>
                    <td>{entityData?.entityCounts.specializations}</td>
                  </tr>
                  <tr>
                    <td>Students</td>
                    <td>{entityData?.entityCounts.students}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pie-chart-container">
              <h5>Student Count by University</h5>
              <PieChart width={450} height={250}>
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="left"
                  wrapperStyle={{
                    fontSize: "10px",
                  }}
                />
                <Pie
                  data={
                    universityData?.studentCountsByUniversity.map(
                      (university: any) => ({
                        name: university.universityName,
                        value: university.studentCount,
                      })
                    ) || []
                  }
                  dataKey="value"
                  nameKey="name"
                  cx="65%"
                  cy="50%"
                  outerRadius={100}
                  fill="#82ca9d"
                  label
                >
                  {universityData?.studentCountsByUniversity.map(
                    (university: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`#${(((1 << 24) * Math.random()) | 0).toString(
                          16
                        )}`}
                      />
                    )
                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>

          <div className="secondline">
            <div className="bar-chart-container">
              <h5>Student count by Department</h5>
              <BarChart
                width={450}
                height={300}
                data={
                  departmentData?.studentCountsByDepartmentWithUniversity.map(
                    (department: any) => ({
                      departmentName: department.departmentName,
                      name: `${department.universityName} - ${department.departmentName}`,
                      count: department.studentCount,
                    })
                  ) || []
                }
                margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="departmentName"
                  angle={-90}
                  textAnchor="end"
                  tick={{ fontSize: 8 }}
                  height={65}
                />
                <YAxis tick={{ fontSize: 8 }} />
                <Tooltip
                  formatter={(value, name, props) => [
                    `number of students: ${value}`,
                    `${props.payload.name}`,
                  ]}
                  contentStyle={{ fontSize: "10px" }}
                />
                <Bar dataKey="count" fill="#ffc658" />
              </BarChart>
            </div>

            <div className="bar-chart-container">
              <h5>Student count by Specialization</h5>
              <BarChart
                width={500}
                height={300}
                data={
                  specializationData?.studentCountsBySpecializationWithDeptAndUniversity.map(
                    (item: any) => ({
                      specializationName: item.specializationName,
                      name: `${item.universityName} - ${item.departmentName} - ${item.specializationName}`,
                      count: item.studentCount,
                    })
                  ) || []
                }
                margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="specializationName"
                  angle={-90}
                  textAnchor="end"
                  tick={{ fontSize: 8 }}
                  height={40}
                />
                <YAxis tick={{ fontSize: 8 }} allowDecimals={false} />
                <Tooltip
                  formatter={(value, name, props) => [
                    `number of students: ${value}`,
                    `${props.payload.name}`,
                  ]}
                  contentStyle={{ fontSize: "10px" }}
                />
                <Bar dataKey="count" fill="#ff7300" />
              </BarChart>
            </div>
          </div>
        </div>
      </div>
      <div id="coder">
        <p>Coded by Najma</p>
      </div>
    </div>
  );
};

export default HomePage;

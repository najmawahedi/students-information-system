import React, { useState, useEffect } from "react";
import { useQuery, gql, useMutation, ApolloCache } from "@apollo/client";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./departmentPage.css";

const GET_UNIVERSITIES = gql`
  query GetUniversities {
    universities {
      id
      name
    }
  }
`;

const GET_DEPARTMENTS = gql`
  query GetDepartments($universityId: Int) {
    departments(universityId: $universityId) {
      id
      name
      university {
        id
        name
      }
    }
  }
`;

const DELETE_DEPARTMENT = gql`
  mutation DeleteDepartment($id: Int!) {
    deleteDepartment(id: $id)
  }
`;

interface University {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
  university: University;
}

const DepartmentPage: React.FC = () => {
  const [selectedUniversityId, setSelectedUniversityId] = useState<
    number | null
  >(null);
  const navigate = useNavigate();
  const location = useLocation(); // Initialize useLocation to access navigation state

  const { data: universitiesData } = useQuery<{ universities: University[] }>(
    GET_UNIVERSITIES
  );
  const { data: departmentsData, refetch } = useQuery<{
    departments: Department[];
  }>(GET_DEPARTMENTS, {
    variables: { universityId: selectedUniversityId },
  });

  useEffect(() => {
    if (location.state?.shouldRefetch) {
      refetch();
    }
  }, [location.state, refetch]);

  const [deleteDepartment] = useMutation(DELETE_DEPARTMENT, {
    update(cache: ApolloCache<any>, { data }) {
      const existingData = cache.readQuery<{ departments: Department[] }>({
        query: GET_DEPARTMENTS,
        variables: { universityId: selectedUniversityId },
      });

      if (existingData && data.deleteDepartment) {
        const newDepartments = existingData.departments.filter(
          (dept) => dept.id !== data.deleteDepartment
        );

        cache.writeQuery({
          query: GET_DEPARTMENTS,
          data: { departments: newDepartments },
          variables: { universityId: selectedUniversityId },
        });

        alert("Department deleted successfully.");
      }
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      deleteDepartment({ variables: { id } }).then(() => {
        refetch();
      });
    }
  };

  return (
    <div className="departmentstyle">
      <h2>Departments</h2>
      <Link to="/addDepartment">
        <button className="ad">Add Department</button>
      </Link>

      <div>
        <select
          onChange={(e) =>
            setSelectedUniversityId(Number(e.target.value) || null)
          }
          value={selectedUniversityId || ""}
        >
          <option value="">Select University</option>
          {universitiesData?.universities.map((university) => (
            <option key={university.id} value={university.id}>
              {university.name}
            </option>
          ))}
        </select>
      </div>

      <div className="table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Department Name</th>
              <th>University</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departmentsData?.departments.map((department) => (
              <tr key={department.id}>
                <td>{department.id}</td>
                <td>{department.name}</td>
                <td>
                  {department.university ? department.university.name : "N/A"}
                </td>
                <td>
                  <button
                    onClick={() => navigate(`/editDepartment/${department.id}`)}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(department.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentPage;

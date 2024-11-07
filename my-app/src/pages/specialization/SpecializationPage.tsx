import React, { useState, useEffect } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import "./specializationPage.css";
const GET_UNIVERSITIES = gql`
  query GetUniversities {
    universities {
      id
      name
    }
  }
`;

const GET_DEPARTMENTS_BY_UNIVERSITY = gql`
  query GetDepartments($universityId: Int!) {
    departments(universityId: $universityId) {
      id
      name
    }
  }
`;

const GET_SPECIALIZATIONS = gql`
  query GetSpecializations($universityId: Int, $departmentId: Int) {
    filteredSpecializations(
      universityId: $universityId
      departmentId: $departmentId
    ) {
      id
      name
      department {
        name
        university {
          name
        }
      }
    }
  }
`;

const DELETE_SPECIALIZATION = gql`
  mutation DeleteSpecialization($id: Int!) {
    deleteSpecialization(id: $id)
  }
`;

const SpecializationPage = () => {
  const [selectedUniversityId, setSelectedUniversityId] = useState<
    number | null
  >(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    number | null
  >(null);
  const navigate = useNavigate();

  const { data: universityData } = useQuery(GET_UNIVERSITIES);
  const { data: departmentData, refetch: refetchDepartments } = useQuery(
    GET_DEPARTMENTS_BY_UNIVERSITY,
    {
      variables: { universityId: selectedUniversityId },
      skip: !selectedUniversityId,
    }
  );
  const { data: specializationData, refetch: refetchSpecializations } =
    useQuery(GET_SPECIALIZATIONS, {
      variables: {
        universityId: selectedUniversityId,
        departmentId: selectedDepartmentId,
      },
    });

  const [deleteSpecialization] = useMutation(DELETE_SPECIALIZATION, {
    onCompleted: (data) => {
      if (data.deleteSpecialization) {
        // Check the response of deletion
        alert("Specialization deleted successfully!");
        refetchSpecializations();
      } else {
        alert("Failed to delete specialization. It might not exist.");
      }
    },
    onError: (error) => {
      alert(
        "An error occurred while deleting specialization: " + error.message
      );
    },
  });

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this specialization?"
    );
    if (confirmDelete) {
      deleteSpecialization({ variables: { id } });
    }
  };

  const handleEdit = (spec: { id: number; name: string }) => {
    navigate(`/edit-specialization/${spec.id}`);
  };

  const handleAddSpecialization = () => {
    navigate("/add-specialization");
  };

  useEffect(() => {
    if (selectedUniversityId) {
      refetchDepartments();
      setSelectedDepartmentId(null);
    }
  }, [selectedUniversityId, refetchDepartments]);

  useEffect(() => {
    refetchSpecializations();
  }, [selectedUniversityId, selectedDepartmentId, refetchSpecializations]);

  return (
    <div className="specialization-page">
      <h2>Specialization</h2>
      <button
        className="AddSpecializationButton"
        onClick={handleAddSpecialization}
      >
        Add Specialization
      </button>{" "}
      <label htmlFor="universitySelect">Select a University</label>
      <select
        value={selectedUniversityId || ""}
        onChange={(e) => setSelectedUniversityId(Number(e.target.value))}
      >
        <label>Select a University</label>
        <option value="">Select University</option>
        {universityData?.universities.map(
          (uni: { id: number; name: string }) => (
            <option key={uni.id} value={uni.id}>
              {uni.name}
            </option>
          )
        )}
      </select>
      <label htmlFor="departmentSelect">Select a Department</label>
      <select
        value={selectedDepartmentId || ""}
        onChange={(e) => setSelectedDepartmentId(Number(e.target.value))}
        disabled={!selectedUniversityId}
      >
        <option value="">Select Department</option>
        {departmentData?.departments.map(
          (dept: { id: number; name: string }) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          )
        )}
      </select>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>University</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {specializationData?.filteredSpecializations.map(
            (spec: {
              id: number;
              name: string;
              department: { name: string; university: { name: string } };
            }) => (
              <tr key={spec.id}>
                <td>{spec.id}</td>
                <td>{spec.name}</td>
                <td>{spec.department.name}</td>
                <td>{spec.department.university.name}</td>
                <td>
                  <button onClick={() => handleEdit(spec)}>Edit</button>
                  <button onClick={() => handleDelete(spec.id)}>Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SpecializationPage;

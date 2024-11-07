import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import "./addSpecialization.css";

export const GET_UNIVERSITIES = gql`
  query GetUniversities {
    universities {
      id
      name
    }
  }
`;

export const GET_DEPARTMENTS_BY_UNIVERSITY = gql`
  query GetDepartmentsByUniversity($universityId: Int!) {
    departments(universityId: $universityId) {
      id
      name
    }
  }
`;

export const CREATE_SPECIALIZATION = gql`
  mutation CreateSpecialization($name: String!, $departmentId: Int!) {
    createSpecialization(name: $name, departmentId: $departmentId) {
      id
      name
    }
  }
`;

interface Department {
  id: number;
  name: string;
}

interface University {
  id: number;
  name: string;
}

const AddSpecialization = () => {
  const [name, setName] = useState("");
  const [universityId, setUniversityId] = useState<number | null>(null);
  const [departmentId, setDepartmentId] = useState<number | null>(null);

  const navigate = useNavigate();

  const {
    data: universityData,
    loading: loadingUniversities,
    error: universityError,
  } = useQuery(GET_UNIVERSITIES);

  const {
    data: departmentData,
    loading: loadingDepartments,
    error: departmentError,
  } = useQuery(GET_DEPARTMENTS_BY_UNIVERSITY, {
    variables: { universityId },
    skip: !universityId,
  });

  const [createSpecialization, { error: mutationError }] = useMutation(
    CREATE_SPECIALIZATION,
    {
      onCompleted: () => {
        alert("Specialization added successfully!");
        setName("");
        setDepartmentId(null);
        setUniversityId(null);
        navigate("/SpecializationPage"); // Redirect to SpecializationPage
      },
      onError: (error) => {
        console.error("Error creating specialization:", error);
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || departmentId === null) {
      alert(
        "Please fill in all fields. A specialization must be associated with a department."
      );
      return;
    }
    createSpecialization({ variables: { name, departmentId } });
  };

  if (loadingUniversities) return <p>Loading universities...</p>;
  if (universityError)
    return <p>Error loading universities: {universityError.message}</p>;

  return (
    <div className="addSstyle">
      <h2>Add New Specialization</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="university">Select University:</label>
          <select
            id="university"
            value={universityId || ""}
            onChange={(e) => {
              setUniversityId(Number(e.target.value));
              setDepartmentId(null);
            }}
            required
          >
            <option value="" disabled>
              Select University
            </option>
            {universityData.universities.map((university: University) => (
              <option key={university.id} value={university.id}>
                {university.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="department">Select Department:</label>
          <select
            id="department"
            value={departmentId || ""}
            onChange={(e) => setDepartmentId(Number(e.target.value))}
            required
            disabled={!universityId}
          >
            <option value="" disabled>
              Select Department
            </option>
            {loadingDepartments ? (
              <option>Loading departments...</option>
            ) : departmentError ? (
              <option>Error loading departments</option>
            ) : (
              departmentData?.departments.map((department: Department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <label htmlFor="name">Specialization Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Specialization</button>
        {mutationError && (
          <p>Error adding specialization: {mutationError.message}</p>
        )}
        <button onClick={() => navigate("/SpecializationPage")}>Cancel</button>
      </form>
    </div>
  );
};

export default AddSpecialization;

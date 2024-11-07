import React, { useState, useEffect } from "react";
import { useMutation, gql, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import "./addDepartment.css";

const GET_UNIVERSITIES = gql`
  query GetUniversities {
    universities {
      id
      name
    }
  }
`;

const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($name: String!, $universityId: Int!) {
    createDepartment(name: $name, universityId: $universityId) {
      id
      name
    }
  }
`;

const AddDepartment = () => {
  const [name, setName] = useState("");
  const [universityId, setUniversityId] = useState<number | null>(null);
  const [universities, setUniversities] = useState<any[]>([]);
  const navigate = useNavigate();

  const {
    data: universityData,
    loading,
    error: queryError,
    refetch,
  } = useQuery(GET_UNIVERSITIES);

  const [createDepartment, { error: mutationError }] = useMutation(
    CREATE_DEPARTMENT,
    {
      onCompleted: () => {
        setName("");
        setUniversityId(null);
        alert("Department added successfully!");
        refetch();
        navigate("/DepartmentPage", { state: { shouldRefetch: true } });
      },
    }
  );

  useEffect(() => {
    if (universityData) {
      setUniversities(universityData.universities);
    }
  }, [universityData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || universityId === null) {
      alert(
        "Please fill in all fields. A department must be associated with a university."
      );
      return;
    }
    createDepartment({ variables: { name, universityId } });
  };

  if (loading) return <p>Loading universities...</p>;
  if (queryError)
    return <p>Error loading universities: {queryError.message}</p>;

  return (
    <div className="addDstyle">
      <h2>Add New Department</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Department Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="university">Select University:</label>
          <select
            id="university"
            value={universityId || ""}
            onChange={(e) => setUniversityId(Number(e.target.value))}
            required
          >
            <option value="" disabled>
              Select University
            </option>
            {universities.map((university) => (
              <option key={university.id} value={university.id}>
                {university.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add Department</button>
        {mutationError && (
          <p>Error adding department: {mutationError.message}</p>
        )}
        <button onClick={() => navigate("/DepartmentPage")}>Cancel</button>
      </form>
    </div>
  );
};

export default AddDepartment;

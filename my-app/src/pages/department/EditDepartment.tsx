import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import "./EditDepartment.css";
const GET_DEPARTMENT = gql`
  query GetDepartment($id: Int!) {
    department(id: $id) {
      id
      name
    }
  }
`;

const EDIT_DEPARTMENT = gql`
  mutation EditDepartment($id: Int!, $name: String!) {
    editDepartment(id: $id, name: $name) {
      id
      name
    }
  }
`;

const EditDepartment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newName, setNewName] = useState("");

  const { data, loading } = useQuery(GET_DEPARTMENT, {
    variables: { id: parseInt(id!) },
    onCompleted: (data) => {
      if (data?.department) {
        setNewName(data.department.name);
      }
    },
  });

  const [editDepartment] = useMutation(EDIT_DEPARTMENT);

  const handleEditSubmit = () => {
    editDepartment({ variables: { id: parseInt(id!), name: newName } })
      .then(() => {
        alert("Department name has been edited successfully.");
        navigate("/DepartmentPage");
      })
      .catch((err) => console.error(err));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="editDstyle">
      <h2>Edit Department</h2>
      <label>Department Name:</label>
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="New Department Name"
      />
      <button onClick={handleEditSubmit}>Update Department</button>
    </div>
  );
};

export default EditDepartment;

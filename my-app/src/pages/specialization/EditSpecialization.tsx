import React, { useEffect, useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import "./EditSpecialization.css";

const GET_SPECIALIZATION = gql`
  query GetSpecialization($id: Int!) {
    specialization(id: $id) {
      id
      name
    }
  }
`;

const UPDATE_SPECIALIZATION = gql`
  mutation UpdateSpecialization($id: Int!, $name: String!) {
    updateSpecialization(id: $id, name: $name) {
      id
      name
    }
  }
`;

const EditSpecialization = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const { data, loading, error } = useQuery(GET_SPECIALIZATION, {
    variables: { id: id ? parseInt(id) : 0 },
    skip: !id,
  });

  const [updateSpecialization] = useMutation(UPDATE_SPECIALIZATION, {
    onCompleted: () => {
      alert("Specialization updated successfully!");
      navigate("/SpecializationPage");
    },
  });

  useEffect(() => {
    if (data) {
      setName(data.specialization.name);
    }
  }, [data]);

  const handleUpdate = () => {
    if (id) {
      updateSpecialization({ variables: { id: parseInt(id), name } });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="editSstyle">
      <h2>Edit Specialization</h2>
      <label>Specialization Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleUpdate}>Update Specialization</button>
    </div>
  );
};

export default EditSpecialization;

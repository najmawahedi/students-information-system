import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";
import "./EditUniversity.css";
const GET_UNIVERSITY = gql`
  query GetUniversity($id: Int!) {
    university(id: $id) {
      id
      name
    }
  }
`;

const UPDATE_UNIVERSITY = gql`
  mutation UpdateUniversity($id: Int!, $name: String!) {
    updateUniversity(id: $id, name: $name) {
      id
      name
    }
  }
`;

const EditUniversity: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading } = useQuery(GET_UNIVERSITY, {
    variables: { id: Number(id) },
  });
  const [updateUniversity] = useMutation(UPDATE_UNIVERSITY);
  const [name, setName] = useState("");

  useEffect(() => {
    if (data && data.university) {
      setName(data.university.name);
    }
  }, [data]);

  const handleUpdate = async () => {
    await updateUniversity({ variables: { id: Number(id), name } });
    alert("University updated successfully!");
    navigate("/UniversityPage");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="editUstyle">
      <h2>Edit University</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
      >
        <label>
          University Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <button type="submit">Update University</button>
      </form>
    </div>
  );
};

export default EditUniversity;

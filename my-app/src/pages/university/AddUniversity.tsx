import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import "./addUniversity.css";

const CREATE_UNIVERSITY = gql`
  mutation CreateUniversity($name: String!) {
    createUniversity(name: $name) {
      id
      name
    }
  }
`;

const AddUniversity = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const [createUniversity, { loading, error }] = useMutation(
    CREATE_UNIVERSITY,
    {
      onCompleted: () => {
        alert("University added successfully!");
        setName("");

        navigate("/UniversityPage");
      },
      onError: (error) => {
        console.error("Error creating university:", error);
      },
      refetchQueries: [
        {
          query: gql`
            query GetUniversities {
              universities {
                id
                name
              }
            }
          `,
        },
      ],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a university name.");
      return;
    }
    createUniversity({ variables: { name } });
  };

  return (
    <div className="addDuniversity">
      <h2>Add New University</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">University Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add University"}
        </button>
        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
        <button onClick={() => navigate("/UniversityPage")}>Cancel</button>
      </form>
    </div>
  );
};

export default AddUniversity;

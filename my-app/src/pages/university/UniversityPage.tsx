import React from "react";
import { Link } from "react-router-dom";
import { useQuery, gql, useMutation, ApolloCache } from "@apollo/client";
import "./UniversityPage.css";
type University = {
  id: number;
  name: string;
};

type GetUniversitiesData = {
  universities: University[];
};

const GET_UNIVERSITIES = gql`
  query GetUniversities {
    universities {
      id
      name
    }
  }
`;

const DELETE_UNIVERSITY = gql`
  mutation DeleteUniversity($id: Int!) {
    deleteUniversity(id: $id) {
      id
      name
    }
  }
`;

const UniversityPage: React.FC = () => {
  const { loading, error, data } =
    useQuery<GetUniversitiesData>(GET_UNIVERSITIES);
  const [deleteUniversity] = useMutation(DELETE_UNIVERSITY);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this university?")) {
      deleteUniversity({
        variables: { id },
        update: (cache: ApolloCache<any>) => {
          const existingData = cache.readQuery<GetUniversitiesData>({
            query: GET_UNIVERSITIES,
          });
          if (existingData && existingData.universities) {
            const newUniversities = existingData.universities.filter(
              (university) => university.id !== id
            );
            cache.writeQuery({
              query: GET_UNIVERSITIES,
              data: { universities: newUniversities },
            });
          }
        },
      })
        .then(() => {
          alert("University has been deleted successfully.");
        })
        .catch((err) => {
          console.error(err);
          alert("Error deleting university.");
        });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="university-page">
      <h2>University List</h2>
      <Link to="/add-university">
        <button className="adduniversity">Add University</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>University Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.universities.map((university) => (
            <tr key={university.id}>
              <td>{university.id}</td>
              <td>{university.name}</td>
              <td>
                <Link to={`/edit-university/${university.id}`}>
                  <button>Edit</button>
                </Link>
                <button onClick={() => handleDelete(university.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UniversityPage;

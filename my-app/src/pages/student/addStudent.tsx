import React, { useEffect, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import "./addStudent.css";

const GET_UNIVERSITIES = gql`
  query GetUniversities {
    universities {
      id
      name
    }
  }
`;
const GET_STUDENTS = gql`
  query GetStudents {
    students {
      id
      name
      email
      age
      specializationId
      departmentId
      universityId
    }
  }
`;

const GET_DEPARTMENTS = gql`
  query GetDepartments($universityId: Int!) {
    university(id: $universityId) {
      departments {
        id
        name
      }
    }
  }
`;

const GET_SPECIALIZATIONS = gql`
  query GetSpecializations($departmentId: Int!) {
    department(id: $departmentId) {
      specializations {
        id
        name
      }
    }
  }
`;

const CREATE_STUDENT = gql`
  mutation CreateStudent(
    $name: String!
    $email: String!
    $age: Int!
    $specializationId: Int!
    $departmentId: Int!
    $universityId: Int!
  ) {
    createStudent(
      name: $name
      email: $email
      age: $age
      specializationId: $specializationId
      departmentId: $departmentId
      universityId: $universityId
    ) {
      id
      name
      email
      age
    }
  }
`;

interface University {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
}

interface Specialization {
  id: number;
  name: string;
}

const AddStudent: React.FC = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const [universities, setUniversities] = useState<University[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(0);
  const [selectedUniversityId, setSelectedUniversityId] = useState<
    string | null
  >(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | null
  >(null);
  const [selectedSpecializationId, setSelectedSpecializationId] = useState<
    string | null
  >(null);

  const { data: dataUniversities } = useQuery(GET_UNIVERSITIES);

  useEffect(() => {
    if (dataUniversities) {
      setUniversities(dataUniversities.universities);
    }
  }, [dataUniversities]);

  const { data: dataDepartments } = useQuery(GET_DEPARTMENTS, {
    variables: {
      universityId: selectedUniversityId ? parseInt(selectedUniversityId) : 0,
    },
    skip: !selectedUniversityId,
  });

  useEffect(() => {
    if (dataDepartments) {
      setDepartments(dataDepartments.university.departments);
      setSelectedDepartmentId(null);
      setSpecializations([]);
    }
  }, [dataDepartments]);

  const { data: dataSpecializations } = useQuery(GET_SPECIALIZATIONS, {
    variables: {
      departmentId: selectedDepartmentId ? parseInt(selectedDepartmentId) : 0,
    },
    skip: !selectedDepartmentId,
  });

  useEffect(() => {
    if (dataSpecializations) {
      setSpecializations(dataSpecializations.department.specializations);
      setSelectedSpecializationId(null);
    }
  }, [dataSpecializations]);

  const [createStudent] = useMutation(CREATE_STUDENT, {
    onCompleted: (data) => {
      alert("Student created successfully!");
      setName("");
      setEmail("");
      setAge(0);
      setSelectedUniversityId(null);
      setSelectedDepartmentId(null);
      setSelectedSpecializationId(null);

      navigate("/students");
    },
    onError: (error) => {
      console.error("Error creating student:", error);
    },
    refetchQueries: [{ query: GET_STUDENTS }],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      selectedSpecializationId &&
      selectedDepartmentId &&
      selectedUniversityId
    ) {
      createStudent({
        variables: {
          name,
          email,
          age,
          specializationId: parseInt(selectedSpecializationId),
          departmentId: parseInt(selectedDepartmentId),
          universityId: parseInt(selectedUniversityId),
        },
      });
    } else {
      alert("Please fill out all fields correctly.");
    }
  };

  return (
    <div className="addstudent">
      <h2>Add Student</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
            required
          />
        </div>
        <div>
          <label>University:</label>
          <select
            value={selectedUniversityId || ""}
            onChange={(e) => {
              setSelectedUniversityId(e.target.value);
            }}
          >
            <option value="">Select a university</option>
            {universities.map((university) => (
              <option key={university.id} value={university.id}>
                {university.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Department:</label>
          <select
            value={selectedDepartmentId || ""}
            onChange={(e) => {
              setSelectedDepartmentId(e.target.value);
            }}
            disabled={!selectedUniversityId}
          >
            <option value="">Select a department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Specialization:</label>
          <select
            value={selectedSpecializationId || ""}
            onChange={(e) => {
              setSelectedSpecializationId(e.target.value);
            }}
            disabled={!selectedDepartmentId}
          >
            <option value="">Select a specialization</option>
            {specializations.map((specialization) => (
              <option key={specialization.id} value={specialization.id}>
                {specialization.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add Student</button>
        <button onClick={() => navigate("/students")}>Cancel</button>
      </form>
    </div>
  );
};

export default AddStudent;

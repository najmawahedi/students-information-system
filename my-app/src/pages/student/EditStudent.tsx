import React, { useEffect, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import "./EditStudent.css";

const GET_STUDENT_BY_ID = gql`
  query GetStudent($id: Int!) {
    student(id: $id) {
      id
      name
      email
      age
      university {
        id
      }
      department {
        id
      }
      specialization {
        id
      }
    }
  }
`;

const GET_UNIVERSITIES = gql`
  query GetUniversities {
    universities {
      id
      name
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

const UPDATE_STUDENT = gql`
  mutation UpdateStudent(
    $id: Int!
    $name: String!
    $email: String!
    $age: Int!
    $specializationId: Int!
    $departmentId: Int!
    $universityId: Int!
  ) {
    updateStudent(
      id: $id
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

const EditStudent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState<number | null>(null);

  const [selectedUniversityId, setSelectedUniversityId] = useState<
    number | null
  >(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    number | null
  >(null);
  const [selectedSpecializationId, setSelectedSpecializationId] = useState<
    number | null
  >(null);

  const [originalData, setOriginalData] = useState<any>(null);
  const [emailError, setEmailError] = useState("");
  const [ageError, setAgeError] = useState("");

  const { data: studentData } = useQuery(GET_STUDENT_BY_ID, {
    variables: { id: id ? parseInt(id) : 0 },
  });

  const { data: universitiesData } = useQuery(GET_UNIVERSITIES);

  const { data: departmentsData } = useQuery(GET_DEPARTMENTS, {
    variables: { universityId: selectedUniversityId || 0 },
    skip: !selectedUniversityId,
  });

  const { data: specializationsData } = useQuery(GET_SPECIALIZATIONS, {
    variables: { departmentId: selectedDepartmentId || 0 },
    skip: !selectedDepartmentId,
  });

  useEffect(() => {
    if (studentData) {
      const { name, email, age, university, department, specialization } =
        studentData.student;
      setName(name);
      setEmail(email);
      setAge(age);
      setSelectedUniversityId(university?.id || null);
      setSelectedDepartmentId(department?.id || null);
      setSelectedSpecializationId(specialization?.id || null);
      setOriginalData({
        name,
        email,
        age,
        university,
        department,
        specialization,
      });
    }
  }, [studentData]);

  const [updateStudent] = useMutation(UPDATE_STUDENT, {
    onCompleted: () => {
      alert("Student updated successfully!");
      navigate("/students");
    },
    onError: (error) => {
      console.error("Error updating student:", error);
    },
  });

  const handleUpdateStudent = () => {
    if (
      id &&
      name &&
      email &&
      age !== null &&
      selectedUniversityId &&
      selectedDepartmentId &&
      selectedSpecializationId
    ) {
      updateStudent({
        variables: {
          id: parseInt(id),
          name,
          email,
          age,
          specializationId: selectedSpecializationId,
          departmentId: selectedDepartmentId,
          universityId: selectedUniversityId,
        },
      });
    } else {
      alert("Please fill out all fields.");
    }
  };

  const handleReset = () => {
    if (originalData) {
      setName(originalData.name);
      setEmail(originalData.email);
      setAge(originalData.age);
      setSelectedUniversityId(originalData.university?.id || null);
      setSelectedDepartmentId(originalData.department?.id || null);
      setSelectedSpecializationId(originalData.specialization?.id || null);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailRegex.test(email) ? "" : "Invalid email format");
    setEmail(email);
  };

  const validateAge = (age: string) => {
    const ageNumber = parseInt(age);
    setAgeError(ageNumber > 0 ? "" : "Age must be a positive number");
    setAge(ageNumber || null);
  };

  return (
    <div className="edit">
      <h2>Edit Student</h2>

      <div>
        <label>University :</label>
        <select
          value={selectedUniversityId || ""}
          onChange={(e) => setSelectedUniversityId(parseInt(e.target.value))}
        >
          <option value="">Select University</option>
          {universitiesData?.universities.map((uni: any) => (
            <option key={uni.id} value={uni.id}>
              {uni.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Department :</label>
        <select
          value={selectedDepartmentId || ""}
          onChange={(e) => setSelectedDepartmentId(parseInt(e.target.value))}
          disabled={!selectedUniversityId}
        >
          <option value="">Select Department</option>
          {departmentsData?.university.departments.map((dept: any) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Specialization:</label>
        <select
          value={selectedSpecializationId || ""}
          onChange={(e) =>
            setSelectedSpecializationId(parseInt(e.target.value))
          }
          disabled={!selectedDepartmentId}
        >
          <option className="special" value="">
            Select Specialization
          </option>
          {specializationsData?.department.specializations.map((spec: any) => (
            <option key={spec.id} value={spec.id}>
              {spec.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => validateEmail(e.target.value)}
        />
        {emailError && <p className="error">{emailError}</p>}
      </div>

      <div>
        <label>Age :</label>
        <input
          type="number"
          value={age || ""}
          onChange={(e) => validateAge(e.target.value)}
        />
        {ageError && <p className="error">{ageError}</p>}
      </div>

      <div>
        <button onClick={handleUpdateStudent}>Update Student</button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={() => navigate("/students")}>Cancel</button>
      </div>
    </div>
  );
};

export default EditStudent;

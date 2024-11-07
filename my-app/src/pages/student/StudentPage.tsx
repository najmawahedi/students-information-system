import React, { useEffect, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import "./StudentPage.css";

import { useNavigate } from "react-router-dom";

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

interface Student {
  id: number;
  name: string;
  email: string;
  age: number;
}

const GET_STUDENTS = gql`
  query {
    students {
      id
      name
      email
      age
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

const GET_STUDENTS_BY_UNIVERSITY = gql`
  query GetStudentsByUniversity($universityId: Int!) {
    studentsByUniversity(universityId: $universityId) {
      id
      name
      email
      age
    }
  }
`;

const GET_STUDENTS_BY_DEPARTMENT_AND_UNIVERSITY = gql`
  query GetStudentsByDepartmentAndUniversity(
    $universityId: Int!
    $departmentId: Int!
  ) {
    studentsByDepartmentAndUniversity(
      universityId: $universityId
      departmentId: $departmentId
    ) {
      id
      name
      email
      age
    }
  }
`;

const GET_STUDENTS_BY_SPECIALIZATION = gql`
  query GetStudentsBySpecialization(
    $universityId: Int!
    $departmentId: Int!
    $specializationId: Int!
  ) {
    studentsBySpecializationDepartmentAndUniversity(
      universityId: $universityId
      departmentId: $departmentId
      specializationId: $specializationId
    ) {
      id
      name
      email
      age
    }
  }
`;
const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: Int!) {
    deleteStudent(id: $id)
  }
`;

const StudentInfo: React.FC = () => {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState<University[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [selectedUniversityId, setSelectedUniversityId] = useState<
    string | null
  >(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | null
  >(null);
  const [selectedSpecializationId, setSelectedSpecializationId] = useState<
    string | null
  >(null);

  const [deleteStudent] = useMutation(DELETE_STUDENT, {
    refetchQueries: [{ query: GET_STUDENTS }],
  });
  const { data: dataAllStudents } = useQuery(GET_STUDENTS);

  const { data: dataUniversities } = useQuery(GET_UNIVERSITIES);

  useEffect(() => {
    if (dataAllStudents) {
      setStudents(
        [...dataAllStudents.students].sort(
          (a: Student, b: Student) => a.id - b.id
        )
      );
    }
  }, [dataAllStudents]);

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

  const { data: dataStudentsByUniversity } = useQuery(
    GET_STUDENTS_BY_UNIVERSITY,
    {
      variables: {
        universityId: selectedUniversityId ? parseInt(selectedUniversityId) : 0,
      },
      skip: !!(
        !selectedUniversityId ||
        selectedDepartmentId ||
        selectedSpecializationId
      ),
    }
  );

  const { data: dataStudentsByDepartmentAndUniversity } = useQuery(
    GET_STUDENTS_BY_DEPARTMENT_AND_UNIVERSITY,
    {
      variables: {
        universityId: selectedUniversityId ? parseInt(selectedUniversityId) : 0,
        departmentId: selectedDepartmentId ? parseInt(selectedDepartmentId) : 0,
      },
      skip: !!(
        !selectedUniversityId ||
        !selectedDepartmentId ||
        selectedSpecializationId
      ),
    }
  );

  const { data: dataStudentsBySpecialization } = useQuery(
    GET_STUDENTS_BY_SPECIALIZATION,
    {
      variables: {
        universityId: selectedUniversityId ? parseInt(selectedUniversityId) : 0,
        departmentId: selectedDepartmentId ? parseInt(selectedDepartmentId) : 0,
        specializationId: selectedSpecializationId
          ? parseInt(selectedSpecializationId)
          : 0,
      },
      skip:
        !selectedUniversityId ||
        !selectedDepartmentId ||
        !selectedSpecializationId,
    }
  );

  useEffect(() => {
    if (dataStudentsByUniversity) {
      setStudents(
        [...dataStudentsByUniversity.studentsByUniversity].sort(
          (a: Student, b: Student) => a.id - b.id
        )
      );
    } else if (dataStudentsByDepartmentAndUniversity) {
      setStudents(
        [
          ...dataStudentsByDepartmentAndUniversity.studentsByDepartmentAndUniversity,
        ].sort((a: Student, b: Student) => a.id - b.id)
      );
    } else if (dataStudentsBySpecialization) {
      setStudents(
        [
          ...dataStudentsBySpecialization.studentsBySpecializationDepartmentAndUniversity,
        ].sort((a: Student, b: Student) => a.id - b.id)
      );
    }
  }, [
    dataStudentsByUniversity,
    dataStudentsByDepartmentAndUniversity,
    dataStudentsBySpecialization,
  ]);

  const handleDeleteStudent = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (confirmDelete) {
      try {
        await deleteStudent({ variables: { id } });
        alert("Student deleted successfully.");
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student.id !== id)
        );
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const handleEditStudent = (id: number) => {
    navigate(`/edit-student/${id}`);
  };

  return (
    <div className="student-page">
      <h2>Students</h2>

      <button
        id="addstudent"
        onClick={() => navigate("/addStudent")}
        className="add-button"
      >
        Add Student
      </button>
      <div className="selectStatments">
        <label htmlFor="university">Select a University:</label>

        <select
          id="university"
          onChange={(e) => setSelectedUniversityId(e.target.value)}
          value={selectedUniversityId || ""}
        >
          <option value="">Select University</option>
          {universities.map((university) => (
            <option key={university.id} value={university.id}>
              {university.name}
            </option>
          ))}
        </select>

        <label htmlFor="department">Select Department:</label>
        <select
          id="department"
          onChange={(e) => setSelectedDepartmentId(e.target.value)}
          value={selectedDepartmentId || ""}
          disabled={selectedUniversityId === null}
        >
          <option value="">Select Department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>

        <label htmlFor="specialization">Select Specialization:</label>
        <select
          id="specialization"
          onChange={(e) => setSelectedSpecializationId(e.target.value)}
          value={selectedSpecializationId || ""}
          disabled={selectedDepartmentId === null}
        >
          <option value="">Select Specialization</option>
          {specializations.map((specialization) => (
            <option key={specialization.id} value={specialization.id}>
              {specialization.name}
            </option>
          ))}
        </select>
      </div>

      <div className="table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.age}</td>
                <td>
                  <button onClick={() => handleEditStudent(student.id)}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteStudent(student.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentInfo;

import React from "react";
import "./App.css";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import client from "./apolloClient";
import HomePage from "./pages/home/HomePage";
import StudentInfo from "./pages/student/StudentPage";
import AddStudent from "./pages/student/addStudent";
import AddDepartment from "./pages/department/addDepartment";
import AddSpecialization from "./pages/specialization/AddSpecialization ";
import AddUniversity from "./pages/university/AddUniversity";
import DepartmentPage from "./pages/department/departmentPage";
import UniversityPage from "./pages/university/UniversityPage";
import SpecializationPage from "./pages/specialization/SpecializationPage";
import EditUniversity from "./pages/university/EditUniversity";
import EditDepartment from "./pages/department/EditDepartment";
import EditSpecialization from "./pages/specialization/EditSpecialization";

import EditStudent from "./pages/student/EditStudent";

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="appclass">
          <header className="header">
            <div className="page-name">Student Management System</div>
            <div>
              <nav className="nav-links">
                <Link to="/" className="dashboard">
                  Dashboard
                </Link>
                <Link to="/students" className="student">
                  Students
                </Link>
                <Link to="/UniversityPage" className="university">
                  Universities
                </Link>

                <Link to="/DepartmentPage" className="department">
                  Departments
                </Link>

                <Link to="/SpecializationPage" className="specialization">
                  Specializations
                </Link>
              </nav>
            </div>
          </header>

          {/* Page Content */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/students" element={<StudentInfo />} />
            <Route path="/DepartmentPage" element={<DepartmentPage />} />
            <Route path="/UniversityPage" element={<UniversityPage />} />
            <Route
              path="/SpecializationPage"
              element={<SpecializationPage />}
            />
            <Route path="/add-university" element={<AddUniversity />} />
            <Route path="/edit-university" element={<EditUniversity />} />
            <Route path="/AddDepartment" element={<AddDepartment />} />
            <Route path="/add-specialization" element={<AddSpecialization />} />
            <Route path="/edit-university/:id" element={<EditUniversity />} />
            <Route path="/editDepartment/:id" element={<EditDepartment />} />
            <Route
              path="/edit-specialization/:id"
              element={<EditSpecialization />}
            />
            <Route path="/addStudent" element={<AddStudent />} />
            <Route path="/edit-student/:id" element={<EditStudent />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;

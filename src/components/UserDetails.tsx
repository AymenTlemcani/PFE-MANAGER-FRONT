import { User } from "../types";

export function UserDetails({ user }: { user: User }) {
  switch (user.role) {
    case "Administrator":
      return (
        <div>
          <h3>Administrator Details</h3>
          <p>
            Name: {user.administrator.name} {user.administrator.surname}
          </p>
          <p>Email: {user.email}</p>
        </div>
      );

    case "Teacher":
      return (
        <div>
          <h3>Teacher Details</h3>
          <p>
            Name: {user.teacher.name} {user.teacher.surname}
          </p>
          <p>Grade: {user.teacher.grade}</p>
          <p>Research Domain: {user.teacher.research_domain}</p>
          <p>Is Responsible: {user.teacher.is_responsible ? "Yes" : "No"}</p>
        </div>
      );

    case "Student":
      return (
        <div>
          <h3>Student Details</h3>
          <p>
            Name: {user.student.name} {user.student.surname}
          </p>
          <p>Master Option: {user.student.master_option}</p>
          <p>Overall Average: {user.student.overall_average}</p>
          <p>Admission Year: {user.student.admission_year}</p>
        </div>
      );

    case "Company":
      return (
        <div>
          <h3>Company Details</h3>
          <p>Company Name: {user.company.company_name}</p>
          <p>
            Contact: {user.company.contact_name} {user.company.contact_surname}
          </p>
          <p>Industry: {user.company.industry}</p>
          <p>Address: {user.company.address}</p>
        </div>
      );

    default:
      return null;
  }
}

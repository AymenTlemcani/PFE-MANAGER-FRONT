import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Book,
  GraduationCap,
  Clock,
  Users,
} from "lucide-react";
import { Button } from "../../components/ui/Button";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  masterOption: string;
  currentProject?: string;
  status: "In Progress" | "Pending Review" | "Ready for Defense";
  grade?: number;
  partner?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    masterOption: string;
  };
  project?: {
    title: string;
    type: "Individual" | "Group";
    status: "In Progress" | "Pending Review" | "Ready for Defense";
  };
}

export function StudentsPage() {
  const [students] = useState<Student[]>([
    {
      id: "1",
      firstName: "Tlemcani",
      lastName: "Aymen",
      email: "aymensalaheddine.tlemcani@univ-tlemcen.dz",
      phone: "0778025629",
      masterOption: "GL",
      status: "In Progress",
      grade: 16.5,
      partner: {
        id: "2",
        firstName: "Riah",
        lastName: "Hamza",
        email: "hamza.riah@univ-tlemcen.dz",
        phone: "0558589288",
        masterOption: "GL",
      },
      project: {
        title: "AI-based Image Recognition System",
        type: "Group",
        status: "In Progress",
      },
    },
    {
      id: "3",
      firstName: "Carol",
      lastName: "Williams",
      email: "carol.williams@university.edu",
      phone: "+216 XX XXX XXX",
      masterOption: "IA",
      status: "Pending Review",
      project: {
        title: "Machine Learning for Healthcare",
        type: "Individual",
        status: "Pending Review",
      },
    },
  ]);

  const stats = [
    { label: "Total Students", value: students.length, icon: GraduationCap },
    { label: "Pending Reviews", value: "2", icon: Clock },
    { label: "Ready for Defense", value: "1", icon: Book },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Students
        </h1>
        <Button variant="outline">Schedule Defense</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-gray-900/30 hover:border-gray-300 dark:hover:border-gray-600"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <Icon className="h-8 w-8 text-blue-600 dark:text-blue-500" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {students.map((student) => (
          <div
            key={student.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 space-y-6 transition-all duration-200 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-gray-900/30 hover:border-gray-300 dark:hover:border-gray-600"
          >
            {/* Project Header */}
            {student.project && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-t-lg p-4 -mx-8 -mt-8 mb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {student.project.title}
                  </h3>
                  <span
                    className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                      student.status === "In Progress"
                        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200"
                        : student.status === "Pending Review"
                        ? "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200"
                        : "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200"
                    }`}
                  >
                    {student.status}
                  </span>
                </div>
              </div>
            )}

            {/* Students Section */}
            <div className="grid gap-6">
              {/* Main Student */}
              <div className="flex items-start space-x-4">
                <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                  <User className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">
                      {student.firstName} {student.lastName}
                    </h4>
                    {student.grade && (
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Grade: {student.grade}/20
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Master {student.masterOption}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Mail className="h-4 w-4 mr-2" />
                      {student.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Phone className="h-4 w-4 mr-2" />
                      {student.phone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Partner Section */}
              {student.partner && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-2 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
                        Working with
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <User className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-medium text-gray-900 dark:text-white">
                          {student.partner.firstName} {student.partner.lastName}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Master {student.partner.masterOption}
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Mail className="h-4 w-4 mr-2" />
                          {student.partner.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Phone className="h-4 w-4 mr-2" />
                          {student.partner.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Actions - Fixed the closing tags structure */}
            <div className="pt-4 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" size="sm" className="px-6">
                Review Progress
              </Button>
              <Button size="sm" className="px-6">
                Submit Grade
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

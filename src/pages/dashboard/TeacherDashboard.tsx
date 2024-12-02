import { BookOpen, Users, Clock, CheckCircle } from "lucide-react";

export function TeacherDashboard() {
  const stats = [
    { label: "My Projects", value: "5", icon: BookOpen },
    { label: "Students Supervised", value: "12", icon: Users },
    { label: "Pending Reviews", value: "3", icon: Clock },
    { label: "Completed Projects", value: "8", icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <Icon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Current Projects
          </h2>
          <div className="space-y-4">
            <ProjectList />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Reviews
          </h2>
          <div className="space-y-4">
            <ReviewsList />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectList() {
  const projects = [
    {
      id: 1,
      title: "AI-based Image Recognition",
      students: "Alice Smith, Bob Johnson",
      status: "In Progress",
    },
    {
      id: 2,
      title: "Blockchain Supply Chain",
      students: "Carol Williams",
      status: "Review Needed",
    },
    {
      id: 3,
      title: "IoT Smart Home System",
      students: "David Brown, Eve Davis",
      status: "In Progress",
    },
  ];

  return (
    <div className="divide-y divide-gray-200">
      {projects.map((project) => (
        <div key={project.id} className="py-4">
          <h3 className="text-sm font-medium text-gray-900">{project.title}</h3>
          <p className="mt-1 text-sm text-gray-500">
            Students: {project.students}
          </p>
          <span className="mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            {project.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function ReviewsList() {
  const reviews = [
    {
      id: 1,
      type: "Progress Review",
      project: "AI-based Image Recognition",
      date: "2024-03-25",
    },
    {
      id: 2,
      type: "Final Defense",
      project: "Blockchain Supply Chain",
      date: "2024-03-28",
    },
    {
      id: 3,
      type: "Initial Proposal",
      project: "Smart City Platform",
      date: "2024-04-01",
    },
  ];

  return (
    <div className="divide-y divide-gray-200">
      {reviews.map((review) => (
        <div key={review.id} className="py-4">
          <h3 className="text-sm font-medium text-gray-900">{review.type}</h3>
          <p className="mt-1 text-sm text-gray-500">{review.project}</p>
          <p className="mt-1 text-sm text-gray-500">Date: {review.date}</p>
        </div>
      ))}
    </div>
  );
}

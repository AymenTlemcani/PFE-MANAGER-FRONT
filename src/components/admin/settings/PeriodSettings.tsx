import { useState } from "react";
import { Button } from "../../ui/Button";
import { Calendar } from "lucide-react";

type PeriodSection = {
  id: string;
  title: string;
  periods: Period[];
};

type Period = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  reminderDays: number;
};

export function PeriodSettings() {
  const [sections, setSections] = useState<PeriodSection[]>([
    {
      id: "proposals",
      title: "Project Proposals",
      periods: [
        {
          id: "1",
          name: "Teacher Proposals",
          startDate: "",
          endDate: "",
          reminderDays: 7,
        },
        {
          id: "2",
          name: "Student Proposals",
          startDate: "",
          endDate: "",
          reminderDays: 7,
        },
        {
          id: "3",
          name: "Company Proposals",
          startDate: "",
          endDate: "",
          reminderDays: 7,
        },
      ],
    },
    {
      id: "assignments",
      title: "Teacher Assignments",
      periods: [
        {
          id: "4",
          name: "Teacher Selection Period",
          startDate: "",
          endDate: "",
          reminderDays: 5,
        },
        {
          id: "5",
          name: "Project Validation",
          startDate: "",
          endDate: "",
          reminderDays: 5,
        },
      ],
    },
    {
      id: "selections",
      title: "Student Selections",
      periods: [
        {
          id: "6",
          name: "Project Selection Period",
          startDate: "",
          endDate: "",
          reminderDays: 5,
        },
        {
          id: "7",
          name: "Team Formation",
          startDate: "",
          endDate: "",
          reminderDays: 3,
        },
      ],
    },
    {
      id: "defense",
      title: "Defense Planning",
      periods: [
        {
          id: "8",
          name: "Jury Assignment",
          startDate: "",
          endDate: "",
          reminderDays: 7,
        },
        {
          id: "9",
          name: "Defense Schedule",
          startDate: "",
          endDate: "",
          reminderDays: 5,
        },
      ],
    },
  ]);

  const handleUpdatePeriod = (
    sectionId: string,
    periodId: string,
    field: keyof Period,
    value: string | number
  ) => {
    setSections(
      sections.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          periods: section.periods.map((period) =>
            period.id === periodId ? { ...period, [field]: value } : period
          ),
        };
      })
    );
  };

  return (
    <div className="h-full">
      <form className="bg-white dark:bg-gray-800 h-full border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg">
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Timeline Settings
          </h2>
        </div>

        <div className="px-8 py-8 space-y-8">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {section.title}
                </h3>
              </div>

              <div className="space-y-6">
                {section.periods.map((period) => (
                  <div
                    key={period.id}
                    className="grid grid-cols-4 gap-6 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {period.name}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs text-gray-500 dark:text-gray-400">
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 [&::-webkit-calendar-picker-indicator]:dark:invert"
                        value={period.startDate}
                        onChange={(e) =>
                          handleUpdatePeriod(
                            section.id,
                            period.id,
                            "startDate",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs text-gray-500 dark:text-gray-400">
                        End Date
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 [&::-webkit-calendar-picker-indicator]:dark:invert"
                        value={period.endDate}
                        onChange={(e) =>
                          handleUpdatePeriod(
                            section.id,
                            period.id,
                            "endDate",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs text-gray-500 dark:text-gray-400">
                        Reminder Days
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2"
                        value={period.reminderDays}
                        onChange={(e) =>
                          handleUpdatePeriod(
                            section.id,
                            period.id,
                            "reminderDays",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-8 py-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end gap-4">
            <Button type="submit">Save Changes</Button>
          </div>
        </div>
      </form>
    </div>
  );
}

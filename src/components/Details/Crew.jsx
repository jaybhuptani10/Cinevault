import React from "react";

const FilmCredits = ({ crew }) => {
  // Function to group crew by department and job
  crew = crew.crew;
  const groupCrewByRole = (crewData) => {
    // Define the display order of departments and specific jobs
    const displayOrder = [
      { department: "Directing", job: "Director" },
      { department: "Production", job: "Producer" },

      { department: "Writing", job: "Writer" },
      { department: "Writing", job: "Story" },
      { department: "Editing", job: "Editor" },
      { department: "Casting", job: "Casting" },
      { department: "Camera", job: "Director of Photography" },
      { department: "Art", job: "Production Design" },
      { department: "Art", job: "Art Direction" },
      // Add more department/job combinations as needed
    ];

    // Create organized sections
    const sections = displayOrder
      .map((orderItem) => {
        const people = crewData.filter(
          (person) =>
            person.department === orderItem.department &&
            person.job === orderItem.job
        );

        // Only include sections that have crew members
        if (people.length === 0) return null;

        return {
          role: orderItem.job.toUpperCase(),
          people,
        };
      })
      .filter((section) => section !== null);

    return sections;
  };

  // Process the crew data
  const creditSections = groupCrewByRole(crew);

  return (
    <div className=" text-gray-400 p-6">
      {/* Credits list */}
      <div className="space-y-4">
        {creditSections.map((section) => (
          <div key={section.role} className="flex">
            <div className="w-56 uppercase tracking-wide flex items-center">
              {section.role}
              <div className="flex-grow mx-2 border-b border-dotted border-gray-700 h-0 mt-1"></div>
            </div>
            <div className="flex flex-wrap gap-2">
              {section.people.map((person) => (
                <div key={person.id} className="bg-gray-800 rounded px-3 py-1">
                  {person.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* If you need to display cast separately */}
      {crew.cast && crew.cast.length > 0 && (
        <div className="mt-8">
          <div className="uppercase tracking-wide mb-4 flex items-center">
            CAST
            <div className="flex-grow mx-2 border-b border-dotted border-gray-700 h-0 mt-1"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {crew.cast.map((person) => (
              <div
                key={person.id}
                className="bg-gray-800 rounded overflow-hidden"
              >
                <div className="p-3">
                  <span className="font-medium">{person.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilmCredits;

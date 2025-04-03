import React from "react";

const Cast = ({ crew }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {crew.cast?.slice(0, 6).map((person) => (
        <div
          key={person.id}
          title={person.character || "Character Name"}
          className="bg-gray-800 rounded overflow-hidden cursor-pointer"
        >
          <div className="p-3">
            <span className="font-medium">{person.name || "Actor Name"}</span>
          </div>
        </div>
      )) ||
        Array(6)
          .fill()
          .map((_, index) => (
            <div key={index} className="bg-gray-800 rounded overflow-hidden">
              <div className="p-3">
                <span className="font-medium">Actor {index + 1}</span>
              </div>
            </div>
          ))}
    </div>
  );
};

export default Cast;

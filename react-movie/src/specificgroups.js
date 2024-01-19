// SpecificGroups.js
import React, { useEffect } from "react";

const SpecificGroups = ({ groupName }) => {
  useEffect(() => {
    // Do something with the selected group name
    console.log(`Selected group: ${groupName}`);
  }, [groupName]);

  return (
    <div>
      <h2>{groupName} Details</h2>
      {/* Add content related to the specific group */}
    </div>
  );
};

export default SpecificGroups;

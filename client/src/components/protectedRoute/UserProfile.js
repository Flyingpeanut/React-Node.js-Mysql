import React from "react";

const UserProfile = props => {
  return (
    <div>
      <div>
        <h1>Profile</h1>
        <h1>Status: {props.loggedInStatus}</h1>
      </div>
    </div>
  );
};

export default UserProfile;

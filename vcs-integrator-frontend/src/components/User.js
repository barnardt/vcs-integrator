import React from 'react';
import Image from 'react-bootstrap/Image';
import Repo from './Repo';

// Component to display VCS user data from API call
function User(props) {
  // Create array of repo data
  const repos = props.user
    ? props.user.repos.map( (repo, i) => {
        return (
          <Repo repo={repo} key={`repo${i}`} />
        );
      })
    : undefined;
    
  let userData = [];
  userData.push(
    props.user
      // If user is truthy, we fill in the user data to display
      ? (
        <div className="w-100">
          <p className="font-weight-bold mb-0 mt-3">Username</p>
          <p>{props.user.userName}</p>
          <Image src={props.user.profilePic} rounded fluid/>
          <p className="font-weight-bold mb-0 mt-3">Bio</p>
          <p>{props.user.bio}</p>
          <p className="font-weight-bold mb-0">Repos</p>
          {repos}
        </div>
      )
      // If it is falsy we display "No data"
      : (
        <div>
          <p>No data</p>
        </div>
      )
  );
  // Return output to be rendered
  return (
    <div className="d-flex flex-column align-items-center border border-secondary 
        rounded p-3 w-100">
      <h3>{props.vcsProvider} result</h3>
      {userData[0]}
    </div>
  );
}

export default User;
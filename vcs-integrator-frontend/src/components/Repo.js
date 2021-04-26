import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

// Function to format ISO data string to more user friendly format
const formatDate = (dateStringInput) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", 
      "September", "October", "November", "December"];

  const tempDate = new Date(dateStringInput);
  let dateStringOutput = 
    tempDate.getDate().toString() + ' ' +
    months[tempDate.getMonth()].substr(0, 3) + ' ' +
    tempDate.getFullYear().toString();

  return dateStringOutput;
}

// Repo component which would be a child of the User component
function Repo(props) {
  // Create variable used to display/hide Collapse components
  const [open, setOpen] = useState(false);
  // Array of commits from API result
  const commits = props.repo.commits.map( (commit, i) => {
    return (
      <tr key={`commit${i}`}>
        <td>
          {formatDate(commit.date)}
        </td>
        <td>
          {commit.description}
        </td>
      </tr>
    );
  });
  // Return JSX to be displayed
  return (<>
    {/* Button to show / hide repo details */}
    <Button 
      variant="primary"
      className="my-1"
      size="lg" 
      block
      onClick={() => setOpen(!open)}
    >
      <strong>{props.repo.name}</strong>
    </Button>
    {/* Collapsible component containing repo details, including commits */}
    <Collapse in={open}>
      <div className="border border-secondary rounded py-3 w-100">
        <p><strong>Created: </strong>{formatDate(props.repo.creationDate)}</p>
        <p><strong>Last updated: </strong>{formatDate(props.repo.lastUpdatedDate)}</p>
        <p className="font-weight-bold"> Commits</p>
        <table>
          <tr>
            <th className='dateRow'>Date</th>
            <th className='messageRow'>Message</th>
          </tr>
          {commits}
        </table>
      </div>
    </Collapse>
  </>);
}

export default Repo;
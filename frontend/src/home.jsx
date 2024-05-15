import "bootstrap/dist/css/bootstrap.css";

import { Link } from "react-router-dom";
import "./style.css";

function Home() {
  return (
    <div>
      <div>
        <h1>Headless CMS Vahan Assignment</h1>
        <p>
          This is a simple headless CMS application where you can create
          entities with attributes and types, and perform CRUD operations on
          them.
        </p>
        <p>
          Use the buttons below to create a new entity or view an existing
          entity
        </p>
      </div>
      <div>
        <Link to="/entity">
          <button className="btn btn-primary">Create Entity</button>
        </Link>
      </div>
      <div>
        <Link to="/viewEntity">
          <button className="btn btn-info">View Entity</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;

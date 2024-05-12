import "bootstrap/dist/css/bootstrap.css";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./style.css";

function EntityView() {
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    try {
      const response = await axios.get("/api/entities");
      //console.log(response)
      setEntities(response.data);
    } catch (error) {
      console.error("Error fetching entities:", error);
    }
  };
  return (
    <div>
      <div>
        <h3 className="container">Created Entities</h3>
      </div>
      <div className="container">
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Entity Name</th>
            </tr>
          </thead>
          <tbody>
            {entities.map((entity) => (
              <tr>
                <td>
                  <a key={entity}>
                    <Link
                      className="btn btn-outline-success"
                      to={`/entity/${entity}`}
                    >
                      {entity}
                    </Link>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="container">
        <Link to="/">
          <button className="btn btn-primary">Home</button>
        </Link>
      </div>
    </div>
  );
}

export default EntityView;

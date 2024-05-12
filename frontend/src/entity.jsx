import "bootstrap/dist/css/bootstrap.css";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

function Entity() {
  const { entityName } = useParams();
  const [columns, setColumns] = useState([]);
  const [entityData, setEntityData] = useState([]);
  const [formData, setFormData] = useState({});
  const [primaryKey, setPrimaryKey] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchEntityColumns(entityName);
    fetchEntityData(entityName);
  }, [entityName]);

  const fetchEntityColumns = async (entityName) => {
    try {
      const response = await axios.get(`/api/entities/${entityName}/columns`);
      const fetchedColumns = response.data;
      //console.log("-----------");
      //console.log(fetchedColumns);
      setColumns(fetchedColumns[0]);
      setPrimaryKey(fetchedColumns[1]);
    } catch (error) {
      console.error(`Error fetching columns for ${entityName}:`, error);
    }
  };

  const fetchEntityData = async (entityName) => {
    try {
      const response = await axios.get(`/api/entities/${entityName}`);
      setEntityData(response.data);
    } catch (error) {
      console.error(`Error fetching data for ${entityName}:`, error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/entities/${entityName}`, formData);
      fetchEntityData(entityName);
      setFormData({});
    } catch (error) {
      console.error(`Error adding data to ${entityName}:`, error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/entities/${entityName}/${id}`);
      fetchEntityData(entityName);
    } catch (error) {
      console.error(`Error deleting row ${id} from ${entityName}:`, error);
      setMessage("Error Deleting row");
    }
  };

  const handleModify = (id) => {
    const selectedRowData = entityData.find((row) => row[primaryKey] === id);
    setFormData(selectedRowData);
    setSelectedRow(selectedRowData);
    //setFormData(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSelectedRow(null);
      console.log(selectedRow, formData);
      await axios.put(
        `/api/entities/${entityName}/${selectedRow[primaryKey]}`,
        formData
      );
      fetchEntityData(entityName);
      setFormData({});
      setSelectedRow(null);
    } catch (error) {
      console.error(`Error updating data in ${entityName}:`, error);
      setMessage("Error Updating row");
    }
  };

  const deleteEntity = async () => {
    try {
      const response = await axios.delete(`/api/delete-entity/${entityName}`);
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error deleting entity");
    }
  };

  return (
    <div>
      {console.log(message)}
      <h2 className="container">{entityName}</h2>
      <div></div>
      <div className="container">
        <div className="s1">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entityData.map((row) => (
                <tr key={row[primaryKey]}>
                  {columns.map((column) => (
                    <td key={column}>{row[column]}</td>
                  ))}
                  <td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(row[primaryKey])}
                      >
                        Delete
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleModify(row[primaryKey])}
                      >
                        Modify
                      </button>
                    </td>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div></div>
        <div className="s2">
          {selectedRow && (
            <form onSubmit={handleUpdate}>
              {columns.map((column) => (
                <div className="form-group" key={column}>
                  <label className="s1" htmlFor={column}>
                    {column}
                  </label>
                  <div></div>
                  <input
                    className="s2 form-control"
                    type="text"
                    id={column}
                    name={column}
                    onChange={handleInputChange}
                    value={formData[column] || ""}
                  />
                </div>
              ))}
              <button className="btn btn-warning" type="submit">
                Update
              </button>
            </form>
          )}
          {!selectedRow && (
            <form onSubmit={handleSubmit}>
              {columns.map((column) => (
                <div className="form-group" key={column}>
                  <label className="s1" htmlFor={column}>
                    {column}
                  </label>
                  <div></div>
                  <input
                    className="s2 form-control"
                    type="text"
                    id={column}
                    name={column}
                    onChange={handleInputChange}
                    value={formData[column] || ""}
                  />
                  <div></div>
                </div>
              ))}
              <button className="btn btn-success" type="submit">
                Add Data
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="container">
        <Link to="/">
          <button className="btn btn-danger" onClick={deleteEntity}>
            Delete Entity
          </button>
        </Link>
      </div>

      <div className="container">
        <Link to="/viewEntity">
          <button className="btn btn-info">View Entity</button>
        </Link>
      </div>

      <div className="container">
        <Link to="/">
          <button className="btn btn-primary">Home</button>
        </Link>
      </div>
    </div>
  );
}

export default Entity;

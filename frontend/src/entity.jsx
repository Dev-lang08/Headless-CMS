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
  const [dateColumn, setDateColumn] = useState(null);
  const [originalData, setOriginalData] = useState({});
  useEffect(() => {
    fetchEntityColumnsandData(entityName);
  }, [entityName]);

  const format = (d) => {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };
  const fetchEntityColumnsandData = async (entityName) => {
    try {
      const response1 = await axios.get(`/api/entities/${entityName}/columns`);
      const response2 = await axios.get(`/api/entities/${entityName}`);
      const fetchedColumns = response1.data;
      //console.log("-----------");
      //console.log(fetchedColumns);
      setColumns(fetchedColumns[0]);
      setPrimaryKey(fetchedColumns[1]);
      setDateColumn(fetchedColumns[2]);
      // if (fetchedColumns[2] != null)
      //   for (let x in response2.data) {
      //     console.log("hi");
      //     const date = new Date(response2.data[x][fetchedColumns[2]]);
      //     const year = date.getFullYear();
      //     const month = String(date.getMonth() + 1).padStart(2, "0");
      //     const day = String(date.getDate()).padStart(2, "0");
      //     response2.data[x][fetchedColumns[2]] = `${day}-${month}-${year}`;
      //   }
      //console.log(response2.data);
      setEntityData(response2.data);
      //console.log(dateColumn);
      //console.log(entityData);
      //console.log(fetchedColumns)
    } catch (error) {
      console.error(`Error fetching columns for ${entityName}:`, error);
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
      fetchEntityColumnsandData(entityName);
      setFormData({});
    } catch (error) {
      console.error(`Error adding data to ${entityName}:`, error);
    }
  };

  const handleDelete = async (id) => {
    try {
      //console.log(id);
      await axios.delete(`/api/entities/${entityName}/${id}`);
      fetchEntityColumnsandData(entityName);
    } catch (error) {
      console.error(`Error deleting row ${id} from ${entityName}:`, error);
      setMessage("Error Deleting row");
    }
  };

  const handleModify = (id) => {
    const selectedRowData = entityData.find((row) => row[primaryKey] === id);
    setFormData(selectedRowData);
    setSelectedRow(selectedRowData);
    setOriginalData(selectedRowData);
    //setFormData(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      //console.log(formData.dob);
      setSelectedRow(null);
      console.log(formData);
      if (dateColumn !== null) {
        const date = new Date(originalData[dateColumn]);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
        originalData[dateColumn] = formattedDate;
      }
      console.log(originalData);
      // console.log(formData);
      // console.log(formData[primaryKey]);
      // console.log(primaryKey);
      // console.log(selectedRow[primaryKey]);
      await axios.put(
        `/api/entities/${entityName}/${originalData[primaryKey]}`,
        formData
      );
      fetchEntityColumnsandData(entityName);
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
      <h1 className="container">{entityName}</h1>
      <div></div>
      <div className="container">
        <div className="s2">
          {selectedRow && (
            <form onSubmit={handleUpdate}>
              {columns.map((column) => (
                <div className="form-group" key={column}>
                  <label className="s1" htmlFor={column}>
                    {column}
                  </label>
                  <div></div>
                  {column === dateColumn && (
                    <input
                      className="s2 form-control"
                      type="date"
                      id={column}
                      name={column}
                      onChange={handleInputChange}
                      value={formData[column] || ""}
                      required
                    />
                  )}
                  {column != dateColumn && (
                    <input
                      className="s2 form-control"
                      type="text"
                      id={column}
                      name={column}
                      onChange={handleInputChange}
                      value={formData[column] || ""}
                      required
                    />
                  )}
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
                  {column === dateColumn && (
                    <input
                      className="s2 form-control"
                      type="date"
                      id={column}
                      name={column}
                      onChange={handleInputChange}
                      value={formData[column] || ""}
                      required
                    />
                  )}
                  {column != dateColumn && (
                    <input
                      className="s2 form-control"
                      type="text"
                      id={column}
                      name={column}
                      onChange={handleInputChange}
                      value={formData[column] || ""}
                      required
                    />
                  )}
                  <div></div>
                </div>
              ))}
              <div></div>
              <div>
                <button className="btn btn-success" type="submit">
                  Add Data
                </button>
              </div>
            </form>
          )}
        </div>
        <div></div>
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
                    <td key={column}>
                      {column == dateColumn ? format(row[column]) : row[column]}
                    </td>
                  ))}
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(row[primaryKey])}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleModify(row[primaryKey])}
                    >
                      Modify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

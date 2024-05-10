// Home.js
import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './style.css'; 

function Home() {
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    try {
      const response = await axios.get('/api/entities');
      console.log(response)
      setEntities(response.data);
    } catch (error) {
      console.error('Error fetching entities:', error);
    }
  };

  return (
    <div>
      <div>
        <h2>Welcome to the Headless CMS</h2>
        <p>This is a simple headless CMS application where you can create entities with attributes and types, and perform CRUD operations on them.</p>
        <p>Use the buttons below to create a new entity</p>
        </div>
        <div>
          <Link to="/entity">
            <button className='btn btn-primary'>Create Entity</button>
          </Link>
        </div>
        <div>
          <div>
            <h3 className='container'>All Entities</h3>
          </div>
          <div className='container'>
            <table className='table table-bordered table-hover'>
              <thead className='thead-dark'>
                <tr>
                  <th>Entity Name</th>
                </tr>
              </thead>
              <tbody>
              {entities.map(entity => (
                          <tr >

                <td><a key={entity}>
                  <Link className='btn btn-outline-success' to={`/entity/${entity}`}>{entity}</Link>
                </a>
                </td>
                </tr>

              ))}
              
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}

export default Home;

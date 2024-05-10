// EntityForm.js (frontend)

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function EntityForm() {
  const [entityName, setEntityName] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [attributeName, setAttributeName] = useState('');
  const [attributeType, setAttributeType] = useState('');
  const [message, setMessage] = useState('');

  const addAttribute = () => {
    if (attributeName && attributeType) {
      setAttributes([...attributes, { name: attributeName, type: attributeType }]);
      setAttributeName('');
      setAttributeType('');
    }
  };

  const removeAttribute = (index) => {
    const updatedAttributes = [...attributes];
    updatedAttributes.splice(index, 1);
    setAttributes(updatedAttributes);
  };

  const createEntity = async () => {
    try {
      const attributesString = attributes.map(attr => `${attr.name} ${attr.type}`).join(', ');
      const response = await axios.post('/api/create-entity', { name: entityName, attributes: attributesString });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error creating entity');
    }
  };

  return (
    <div>
      <h2>Create Entity</h2>
      <div>
              <input className=''
                type="text"
                placeholder="Enter an Entity Name"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
              />
              </div>
      <div className='container'>
        <div className='s1'>
          
              <div>
              <input className=''
                type="text"
                placeholder="Attribute Name"
                value={attributeName}
                onChange={(e) => setAttributeName(e.target.value)}
              />
              </div>
            <div>
              <input className=''
                type="text"
                placeholder="Attribute Type"
                value={attributeType}
                onChange={(e) => setAttributeType(e.target.value)}
              />
            </div>
            <div>
              <button className='btn btn-info' onClick={addAttribute}>Add Attribute</button>
            </div>
          </div>
        <div className='s2'>
          <table className='table table-bordered table-hover'>
            <thead>
              <tr>
                <th>Attribute Name</th>
                <th>Attribute Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
          {attributes.map((attr, index) => (
            <tr key={index}>
              <td>{attr.name} </td>
              <td>({attr.type})</td>
              <td><button className='btn btn-danger' onClick={() => removeAttribute(index)}>Remove</button></td>
            </tr>
          ))}
          </tbody>
          </table>
        </div>
      </div>
      <div className='container'>
        <button className='btn btn-success' onClick={createEntity}>Create</button>
        {message && <p>{message}</p>}
      </div>
      <div className='container'>
        <Link to="/">
          <button className='btn btn-primary'>Home</button>
        </Link>
      </div>
    </div>
    
  );
}

export default EntityForm;

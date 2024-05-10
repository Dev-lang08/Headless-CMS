import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function EntityForm() {
  const [entityName, setEntityName] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [attributeName, setAttributeName] = useState('');
  const [attributeType, setAttributeType] = useState('');
  const [attributeLength, setAttributeLength] = useState('');
  const [isPrimaryKey, setIsPrimaryKey] = useState(false);
  const [isNotNull, setIsNotNull] = useState(false);
  const [editIndex, setEditIndex] = useState(null); // Track the index of the attribute being edited
  const [message, setMessage] = useState('');

  const attributeTypes = ['VARCHAR', 'INT', 'FLOAT', 'DATE', 'BIGINT', 'DOUBLE', 'FLOAT']; // Define available attribute types

  const addAttribute = () => {
    if (attributeName && attributeType) {
      const attribute = {
        name: attributeName,
        type: attributeType,
        length: attributeLength,
        primaryKey: isPrimaryKey,
        notNull: isNotNull
      };
      if (editIndex !== null) {
        const updatedAttributes = [...attributes];
        updatedAttributes[editIndex] = attribute;
        setAttributes(updatedAttributes);
        setEditIndex(null);
      } else {
        setAttributes([...attributes, attribute]);
      }
      setAttributeName('');
      setAttributeType('');
      setAttributeLength('');
      setIsPrimaryKey(false);
      setIsNotNull(false);
    }
  };

  const editAttribute = (index) => {
    const attribute = attributes[index];
    setAttributeName(attribute.name);
    setAttributeType(attribute.type);
    setAttributeLength(attribute.length);
    setIsPrimaryKey(attribute.primaryKey);
    setIsNotNull(attribute.notNull);
    setEditIndex(index);
  };

  const removeAttribute = (index) => {
    const updatedAttributes = [...attributes];
    updatedAttributes.splice(index, 1);
    setAttributes(updatedAttributes);
  };

  const togglePrimaryKey = () => {
    const isPrimaryKeySet = attributes.some(attr => attr.primaryKey);
    if (!isPrimaryKeySet) {
      setIsPrimaryKey(!isPrimaryKey);
    }
  };

  const createEntity = async () => {
    if(attributes.length > 0 && entityName)
    try {
      const attributesString = attributes.map(attr => {
        let attributeStr = `${attr.name} ${attr.type}`;
        if (attr.length) {
          attributeStr += `(${attr.length})`;
        }
        if (attr.primaryKey) {
          attributeStr += ' PRIMARY KEY';
        }
        if (attr.notNull) {
          attributeStr += ' NOT NULL';
        }
        return attributeStr;
      }).join(', ');
      const response = await axios.post('/api/create-entity', { name: entityName, attributes: attributesString });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error creating entity');
    }
  };

  return (
    <div>
      <h2>Create Entity</h2>
      <div className='input-group has-validation container'>
        <input className='form-control'
          type="text"
          placeholder="Enter an Entity Name"
          value={entityName}
          required
          onChange={(e) => setEntityName(e.target.value)}
        />
      </div>
      <div className='container'>
        <div className='s1'>
          <div>
            <input className='form-control'
              type="text"
              placeholder="Attribute Name"
              value={attributeName}
              onChange={(e) => setAttributeName(e.target.value)}
            />
          </div>
          <div className='dropdown'>
            <select className='btn btn-secondary dropdown-toggle'
              value={attributeType}
              onChange={(e) => setAttributeType(e.target.value)}
            >
              <option className='dropdown-item' value="">Select Attribute Type</option>
              {attributeTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
          {attributeType && attributeType !== 'DATE' && (
            <div>
              <input className='form-control'
                type="number"
                placeholder="Attribute Length"
                value={attributeLength}
                onChange={(e) => setAttributeLength(e.target.value)}
              />
            </div>
          )}
          <div className='form-check'>
            <label className='form-check-label'>
              <input className='form-check-input'
                type="checkbox"
                checked={isPrimaryKey}
                disabled={attributes.some(attr => attr.primaryKey)}
                onChange={togglePrimaryKey}
              /> Primary Key
            </label>
          </div>
          <div className='form-check'>
            <label className='form-check-label'>
              <input className='form-check-input'
                type="checkbox"
                checked={isNotNull}
                onChange={(e) => setIsNotNull(e.target.checked)}
              /> Not Null
            </label>
          </div>
          <div>
            <button className='btn btn-info' onClick={addAttribute}>
              {editIndex !== null ? 'Update Attribute' : 'Add Attribute'}
            </button>
          </div>
        </div>
        <div className='s2'>
          <table className='table table-bordered table-hover'>
            <thead>
              <tr>
                <th>Attribute Name</th>
                <th>Attribute Type</th>
                <th>Length</th>
                <th>Primary Key</th>
                <th>Not Null</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {attributes.map((attr, index) => (
                <tr key={index}>
                  <td>{attr.name}</td>
                  <td>{attr.type}</td>
                  <td>{attr.length}</td>
                  <td>{attr.primaryKey ? 'Yes' : 'No'}</td>
                  <td>{attr.notNull ? 'Yes' : 'No'}</td>
                  <td>
                    <button className='btn btn-warning' onClick={() => editAttribute(index)}>Edit</button>
                    <div></div>
                    <button className='btn btn-danger' onClick={() => removeAttribute(index)}>Remove</button>
                  </td>
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

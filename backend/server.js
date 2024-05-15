const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = 3001;

// MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
});

// Connecting to the database and using database vahan
connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  connection.query(
    "CREATE DATABASE if not exists vahan",
    function (err, result) {
      if (err) throw err;
      console.log("Database created");
    }
  );
  connection.query("use vahan");
});

app.use(bodyParser.json());

// Get request to fetch all entities present in the database
app.get("/api/entities", (req, res) => {
  const query = "SHOW TABLES";
  connection.query(query, (error, results, fields) => {
    //console.log(results);
    if (error) {
      console.error("Error fetching entities:", error);
      res.status(500).json({ error: "Error fetching entities" });
    } else {
      const entities = results.map((result) => result.Tables_in_vahan);
      res.json(entities);
    }
  });
});

// Post request to create a new entity using the data inputted by the user
app.post("/api/create-entity", (req, res) => {
  const { name, attributes } = req.body;
  // console.log();
  // console.log(req.body);
  // console.log();
  const createEntityTableQuery = `CREATE TABLE ${name} (${attributes})`;
  connection.query(createEntityTableQuery, (error, results, fields) => {
    if (error) {
      console.error("Error creating entity table:", error);
      res.status(500).json({ error: "Error creating entity table" });
    } else {
      console.log("Entity table created successfully");
      res.json({ message: "Entity created successfully" });
    }
  });
});

// get request to get all values from a table
app.get("/api/entities/:entityName", async (req, res) => {
  const entityName = req.params.entityName;
  const query = `SELECT * FROM ${entityName}`;
  const dob = await getDOB(entityName);
  //console.log(dob);
  connection.query(query, (error, results, fields) => {
    if (error) {
      console.error(`Error fetching data for ${entityName}:`, error);
      res.status(500).json({ error: `Error fetching data for ${entityName}` });
    } else {
      dob.map(function (d) {
        if (d != null) {
          //console.log(d);
          results.forEach((result) => {
            result[d] = formatDate(result[d]);
          });
        }
      });
      res.json(results);
    }
  });
});

// retrive column of a table
app.get("/api/entities/:entityName/columns", async (req, res) => {
  const entityName = req.params.entityName;
  const columns = await getColumnNames(entityName);
  const primaryKey = await getPrimaryKey(entityName);
  var key = null;
  for (const val of primaryKey) {
    if (val != null) key = val;
  }

  if (key == null) key = columns[0];

  const date = await getDOB(entityName);

  let dt = null;
  for (let x of date) {
    if (x != null) dt = x;
  }
  const query = `
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = '${entityName}'
    AND TABLE_SCHEMA = DATABASE()`;
  connection.query(query, (error, results, fields) => {
    if (error) {
      console.error(`Error fetching columns for ${entityName}:`, error);
      res
        .status(500)
        .json({ error: `Error fetching columns for ${entityName}` });
    } else {
      const columns = results.map((result) => result.COLUMN_NAME);
      res.json([columns, key, dt]);
    }
  });
});

// insert new values into the table
app.post("/api/entities/:entityName", (req, res) => {
  const { entityName } = req.params;
  const data = req.body;
  const query = `INSERT INTO ${entityName} SET ?`;
  connection.query(query, data, (error, results, fields) => {
    if (error) {
      console.error(`Error adding data to ${entityName}:`, error);
      res.status(500).json({ error: `Error adding data to ${entityName}` });
    } else {
      res.status(200).json({ message: `Data added to ${entityName}` });
    }
  });
});

// update values in a table
app.put("/api/entities/:entityName/:id", async (req, res) => {
  const { entityName, id } = req.params;
  const data = req.body;
  //console.log(data);
  const setClause = Object.keys(data)
    .map((key) => `${key} = '${data[key]}'`)
    .join(", ");
  //console.log("HI", entityName);
  const columns = await getColumnNames(entityName);
  const primaryKey = await getPrimaryKey(entityName);
  var key = null;
  for (const val of primaryKey) {
    if (val != null) key = val;
  }
  if (key == null) key = columns[0];
  // console.log("hi");
  // console.log(id,primaryKey[0], key);
  // console.log("hi2");

  const query = `UPDATE ${entityName} SET ${setClause} WHERE ${key} = '${id}'`;

  //console.log(query, id);
  connection.query(query, [id], (error, results, fields) => {
    if (error) {
      console.error(`Error updating row ${id} in ${entityName}:`, error);
      res
        .status(500)
        .json({ error: `Error updating row ${id} in ${entityName}` });
    } else {
      res.status(200).json({ message: `Row ${id} updated in ${entityName}` });
    }
  });
});

// delete a row from a table
app.delete("/api/entities/:entityName/:id", async (req, res) => {
  const { entityName, id } = req.params;
  try {
    const columns = await getColumnNames(entityName);
    const primaryKey = await getPrimaryKey(entityName);
    var key = null;
    for (const val of primaryKey) {
      if (val != null) key = val;
    }
    if (key == null) key = columns[0];

    const query = `DELETE FROM ${entityName} WHERE ${key} = '${id}'`;
    console.log(query);
    connection.query(query, [id], (error, results, fields) => {
      if (error) {
        console.error(`Error deleting row ${id} from ${entityName}:`, error);
        res
          .status(500)
          .json({ error: `Error deleting row ${id} from ${entityName}` });
      } else {
        res
          .status(200)
          .json({ message: `Row ${id} deleted from ${entityName}` });
      }
    });
  } catch (error) {
    console.error(`Error fetching columns for ${entityName}:`, error);
    res.status(500).json({ error: `Error fetching columns for ${entityName}` });
  }
});

// delete and entire entity(table)
app.delete("/api/delete-entity/:entityName/", async (req, res) => {
  const { entityName, id } = req.params;
  try {
    const query = `DROP TABLE ${entityName}`;
    //console.log(query);
    connection.query(query, [id], (error, results, fields) => {
      if (error) {
        console.error(`Error deleting row ${id} from ${entityName}:`, error);
        res
          .status(500)
          .json({ error: `Error deleting row ${id} from ${entityName}` });
      } else {
        res
          .status(200)
          .json({ message: `Row ${id} deleted from ${entityName}` });
      }
    });
  } catch (error) {
    console.error(`Error fetching columns for ${entityName}:`, error);
    res.status(500).json({ error: `Error fetching columns for ${entityName}` });
  }
});

// Function to fetch column names for a specific entity
const getColumnNames = (entityName) => {
  return new Promise((resolve, reject) => {
    const query = `SHOW COLUMNS FROM ${entityName}`;
    connection.query(query, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        const columns = results.map((result) => result.Field);
        resolve(columns);
      }
    });
  });
};

// Function to fetch the primary key of an column
const getPrimaryKey = (entityName) => {
  //console.log("--------------------");
  return new Promise((resolve, reject) => {
    const query = `SHOW COLUMNS FROM ${entityName}`;
    //console.log(query);
    connection.query(query, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        const columns = results.map(function (result) {
          //console.log(result);
          if (result.Key == "PRI") {
            return result.Field;
          } else return null;
        });
        resolve(columns);
      }
    });
  });
};

// function to check if date field is present in the columns
const getDOB = (entityName) => {
  return new Promise((resolve, reject) => {
    const query = `SHOW COLUMNS FROM ${entityName}`;
    connection.query(query, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        const columns = results.map(function (result) {
          //console.log(result);
          if (result.Type == "date") {
            return result.Field;
          }
          return null;
        });
        resolve(columns);
      }
    });
  });
};

// function to format Date type data
function formatDate(dateString) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

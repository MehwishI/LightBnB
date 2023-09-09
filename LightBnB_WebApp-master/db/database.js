const { response } = require("express");
const properties = require("./json/properties.json");
const users = require("./json/users.json");

const {Pool} = require("pg");
const pool = new Pool ({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb',
  port: 5432
});
pool.connect()
.then(()=>{
console.log("Connected to Database!!");
});

const getAllProperties = (options, limit = 10) => {

  return pool
    .query(
      `SELECT * FROM properties LIMIT $1`,[limit])
    .then((result) => {
      return result.rows
    })
    .catch((err) => {
      console.log(err.message);
    });
  // 1
  // const queryParams = [];
  // // 2
  // let queryString = `
  // SELECT properties.*, avg(property_reviews.rating) as average_rating
  // FROM properties
  // JOIN property_reviews ON properties.id = property_id
  // `;

  // // 3
  // if (options.city) {
  //   queryParams.push(`%${options.city}%`);
  //   queryString += `WHERE city LIKE $${queryParams.length} `;
  // }
  // if(options.owner_id) {
  //   queryParams.push(`${options.owner_id}`);
  //   queryString += `WHERE owner_id LIKE $${queryParams.length}`;
  //   queryString += ` AND`
  // }
  // if(options.minimum_price_per_night && options.maximum_price_per_night) {
  //   queryParams.push(`${options.minimum_price_per_night}`*100);
  //   queryParams.push(`${options.maximum_price_per_night}`*100);
  //   queryString += `WHERE cost_per_night BETWEEN $${queryParams.length-1} and $${queryParams.length}`;
  //   queryString += ` AND`;
  // }
  // if(options.minimum_rating) {
  //   queryParams.push(`${options.minimum_rating}`);
  //   queryString += `HAVING avg(property_reviews.rating) >= ${queryParams.length}`;
  // }

  // // 4
  // queryParams.push(limit);
  // queryString += `
  // GROUP BY properties.id
  // ORDER BY cost_per_night
  // LIMIT $${queryParams.length};
  // `;

  // // 5
  // console.log(queryString, queryParams);

  // // 6
  // return pool.query(queryString, queryParams).then((res) => res.rows);
};

// pool.query(`SELECT title FROM properties LIMIT 10;`)
// .then(response => {console.log(response)})
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  
  return pool
  .query(
    `SELECT *
    from users
    WHERE email =$1`,[email])
  .then((result) => {
    return result.rows[0] //return just first element
  })
  .catch((err) => {
    console.log(err.message);
  });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
 // return Promise.resolve(users[id]);
  return pool
  .query(
    `SELECT *
    from users
    WHERE id =$1`,[id])
  .then((result) => {
    return result.rows[0]
  })
  .catch((err) => {
    console.log(err.message);
  });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);

  return pool
  .query(
    `INSERT INTO users (name,email,password)
    VALUES ($1,$2,$3) RETURNING *;`,[user.name,user.email,user.password])
  .then((result) => {
    console.log(result.rows[0])
    return result.rows[0]
  })
  .catch((err) => {
    console.log(err.message);
  });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {

  return pool
  .query(
   `SELECT r.id, p.title, r.start_date,p.cost_per_night, AVG(a.rating) as average_rating
   FROM reservations r
   JOIN properties p
   ON r.property_id =p.id
   JOIN property_reviews a
   ON a.property_id = p.id
   WHERE r.guest_id=$1
   GROUP BY r.id, p.id
   ORDER BY r.start_date
   LIMIT $2`,[guest_id,limit])
  .then((result) => {
    return result.rows[0]
  })
  .catch((err) => {
    console.log(err.message);
  });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// const getAllProperties = function (options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// };

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);

  return pool
  .query(
    `INSERT INTO properties (owner_id, 
      title, 
      description, 
      thumbnail_photo_url,
      cover_photo_url,
      cost_per_night,
      parking_spaces,
      number_of_bathrooms,
      number_of_bedrooms,
      country,
      street,
      city,
      province,
      post_code)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *;`,
    [ property.owner_id, 
      property.title, 
      property.description, 
      property.thumbnail_photo_url,
      property.cover_photo_url,
      property.cost_per_night,
      property.parking_spaces,
      property.number_of_bathrooms,
      property.number_of_bedrooms,
      property.country,
      property.street,
      property.city,
      property.province,
      property.post_code])
  .then((result) => {
    console.log(result.rows[0])
    return result.rows[0]
  })
  .catch((err) => {
    console.log(err.message);
  });
};


module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};

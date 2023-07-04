//Express Server
const express = require('express');
const cors = require('cors');
const app = express().use(cors());
//Postgres DB
const {db} = require('./db/connection')
//GraphQL
const fs = require('fs');
const {buildSchema} = require('graphql')
const {graphqlHTTP} = require('express-graphql')
//bcrypt to hash password
const bcrypt = require('bcrypt');
//jwt for token
const jwt = require('jsonwebtoken');
const SECRET_KEY = "Project2023"

//DB Connection
db.connect();

// handling CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin",
        "http://localhost:4200");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/*function getTokenPayload(token) {
    return jwt.verify(token, SECRET_KEY);
}

function getUserId(req, authToken) {
    if (req) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            if (!token) {
                throw new Error('No token found');
            }
            const { userId } = getTokenPayload(token);
            return userId;
        }
    } else if (authToken) {
        const { userId } = getTokenPayload(authToken);
        return userId;
    }

    throw new Error('Not authenticated');
}*/

const schema = buildSchema(fs.readFileSync('schema.graphql', 'utf8'));

const root = {
    getAllFilmsWithCategory: args => {
        return db.query(
            `SELECT f.film_id,
                    f.title        as film_title,
                    f.release_year as release_year,
                    f.rating       as rating,
                    ca.name        as category,
                    l.name         as language,
                    f.rental_rate  as cost
             FROM film AS f
                      JOIN film_category AS fc ON f.film_id = fc.film_id
                      JOIN category AS ca ON fc.category_id = ca.category_id
                      JOIN language as l ON l.language_id = f.language_id
             ORDER BY title
             LIMIT ${args.limit} OFFSET ${args.offset}`).then(
            (res) => (res.rows)
        ).catch(
            (error) => (console.log(error))
        );
    },

    getFilmsByTitle: args => {
        return db.query(
            `SELECT f.film_id,
                    f.title        as film_title,
                    f.release_year as release_year,
                    f.rating       as rating,
                    ca.name        as category,
                    l.name         as language,
                    f.rental_rate  as cost
             FROM film AS f
                      JOIN film_category AS fc ON f.film_id = fc.film_id
                      JOIN category AS ca ON fc.category_id = ca.category_id
                      JOIN language as l ON l.language_id = f.language_id
             WHERE title ILIKE '%${args.filmTitle}%'
             ORDER BY title`).then(
            (res) => (res.rows)
        ).catch(
            (error) => (console.log(error))
        );
    },

    getFilmById: args => {
        return db.query(
            `SELECT film_id, title as film_title, description, release_year, rental_rate as cost
             FROM film
             WHERE film_id = ${args.id}`).then(
            (res) => (res.rows[0])
        ).catch(
            (error) => (console.log(error))
        );
    },

    getFilmInfoById: args => {
        return db.query(
            `SELECT f.film_id,
                    f.title        as film_title,
                    f.release_year as release_year,
                    f.length,
                    f.description,
                    f.rating       as rating,
                    ca.name        as category,
                    l.name         as language,
                    f.rental_rate  as cost,
                    f.rental_duration

             FROM film AS f
                      JOIN film_category AS fc ON f.film_id = fc.film_id
                      JOIN category AS ca ON fc.category_id = ca.category_id
                      JOIN language as l ON l.language_id = f.language_id
             WHERE f.film_id = ${args.filmId}`).then(
            (res) => (res.rows[0])
        ).catch(
            (error) => (console.log(error))
        );
    },

    getFilmsByCategory: args => {
        return db.query(
            `SELECT f.film_id,
                    f.title        as film_title,
                    f.release_year as release_year,
                    f.rating       as rating,
                    ca.name        as category,
                    l.name         as language,
                    f.rental_rate  as cost
             FROM film AS f
                      JOIN film_category AS fc ON f.film_id = fc.film_id
                      JOIN category AS ca ON fc.category_id = ca.category_id
                      JOIN language as l ON l.language_id = f.language_id
             WHERE ca.name = '${args.categoryName}'
             ORDER BY title`).then(
            (res) => (res.rows)
        ).catch(
            (error) => (console.log(error))
        );
    },

    getFilmsByCategoryAndTitle: args => {
        return db.query(
            `SELECT f.film_id,
                    f.title        as film_title,
                    f.release_year as release_year,
                    f.rating       as rating,
                    ca.name        as category,
                    l.name         as language,
                    f.rental_rate  as cost
             FROM film AS f
                      JOIN film_category AS fc ON f.film_id = fc.film_id
                      JOIN category AS ca ON fc.category_id = ca.category_id
                      JOIN language as l ON l.language_id = f.language_id
             WHERE ca.name = '${args.categoryName}'
               AND f.title ILIKE '%${args.filmTitle}%'
             ORDER BY f.title`).then(
            (res) => (res.rows)
        ).catch(
            (error) => (console.log(error))
        );
    },

    getAllCategories: () => {
        return db.query(
            `SELECT DISTINCT category_id, name as category
             FROM category
             ORDER BY category_id`).then(
            (res) => (res.rows)
        ).catch(
            (error) => (console.log(error))
        );
    },

    getAllStores: () => {
        return db.query(
            `SELECT s.store_id, ad.address, ad.district, cit.city, cou.country
             FROM store AS s
                      JOIN address AS ad
                           ON s.address_id = ad.address_id
                      JOIN city AS cit
                           ON ad.city_id = cit.city_id
                      JOIN country AS cou
                           ON cit.country_id = cou.country_id`).then(
            (res) => (res.rows)
        ).catch(
            (error) => (console.log(error))
        );
    },

    getFilmActors: args => {
        return db.query(
            `SELECT *
             FROM film_actor as fa
                      JOIN actor as act
                           ON fa.actor_id = act.actor_id
             WHERE fa.film_id = ${args.filmId}`).then(
            (res) => (res.rows)
        ).catch(
            (error) => (console.log(error))
        );
    },

    getStoreDispByFilmId: args => {
        return db.query(
            `SELECT DISTINCT inv.store_id, ad.address, cit.city, cou.country
             FROM inventory AS inv
                      JOIN rental AS re ON inv.inventory_id = re.inventory_id
                      JOIN store AS st ON inv.store_id = st.store_id
                      JOIN address AS ad ON st.address_id = ad.address_id
                      JOIN city AS cit ON ad.city_id = cit.city_id
                      JOIN country AS cou ON cit.country_id = cou.country_id
             WHERE inv.film_id = ${args.filmId}
               AND inv.inventory_id NOT IN (SELECT inv.inventory_id
                                            from inventory as inv
                                                     JOIN rental as re
                                                          ON inv.inventory_id = re.inventory_id
                                            WHERE inv.film_id = ${args.filmId}
                                              and re.return_date is null)`).then(
            (res) => (res.rows)
        ).catch(
            (error) => (console.log(error))
        );
    },

    signIn: args => {
        return db.query(
            `SELECT *
             FROM credentials
             WHERE username = '${args.username}'`).then(
            async (res) => {
                /*bcrypt.hash("password", 10, function(err, hash) {
                    console.log(hash);
                });*/

                // Check if username is valid: if not then throw error
                if (!res.rows[0]) {
                    throw new Error('No such user found')
                }
                // Check if password is valid: if not then throw error
                const validPass = await bcrypt.compare(args.password, res.rows[0].password);
                if (!validPass) {
                    throw new Error('Invalid password');
                }
                // Create token
                res.rows[0].token = jwt.sign({customerId: res.rows[0].customer_id}, SECRET_KEY, {expiresIn: 300});
                return res.rows[0];
            }
        ).catch(
            (error) => (console.log(error))
        );
    },

    getRentalInfoByCustId: args => {
        return db.query(
            `SELECT re.customer_id,
                    re.rental_id,
                    f.title    AS film_title,
                    ad.address AS shop,
                    inv.store_id,
                    pay.amount,
                    pay.payment_date,
                    re.rental_date,
                    re.return_date
             FROM payment AS pay
                      JOIN rental AS re ON pay.rental_id = re.rental_id
                      JOIN inventory AS inv ON re.inventory_id = inv.inventory_id
                      JOIN film AS f ON inv.film_id = f.film_id
                      JOIN store AS sto ON inv.store_id = sto.store_id
                      JOIN address AS ad ON sto.address_id = ad.address_id
             WHERE re.customer_id = ${args.customerId}`).then(
            (res) => (res.rows)
        ).catch(
            (error) => (console.log(error))
        );
    },
    getRentalInfoByRenId: args => {
        return db.query(
            `SELECT re.rental_id,
                    f.title       as film_title,
                    inv.store_id,
                    pay.amount,
                    re.rental_date,
                    re.return_date,
                    pay.payment_date,
                    st.first_name as staff_first_name,
                    st.last_name  as staff_last_name,
                    st.email      as staff_email
             FROM staff AS st
                      JOIN payment AS pay ON st.staff_id = pay.staff_id
                      JOIN rental AS re ON pay.rental_id = re.rental_id
                      JOIN inventory AS inv ON re.inventory_id = inv.inventory_id
                      JOIN film AS f ON inv.film_id = f.film_id
             WHERE re.rental_id = ${args.rentalId}`).then(
            (res) => (res.rows[0])
        ).catch(
            (error) => (console.log(error))
        );
    },
    getStoreById: args => {
        return db.query(
            `SELECT s.store_id, ad.address, ad.district, cit.city, cou.country
             FROM store AS s
                      JOIN address AS ad
                           ON s.address_id = ad.address_id
                      JOIN city AS cit
                           ON ad.city_id = cit.city_id
                      JOIN country AS cou
                           ON cit.country_id = cou.country_id
             WHERE s.store_id = ${args.storeId}`).then(
            (res) => (res.rows[0])
        ).catch(
            (error) => (console.log(error))
        );
    },
    getAllFilm: args => {
        return db.query(
            `SELECT f.film_id,
                    f.title        as film_title,
                    f.release_year as release_year,
                    f.rating       as rating,
                    ca.name        as category,
                    l.name         as language,
                    f.rental_rate  as cost
             FROM film AS f
                      JOIN film_category AS fc ON f.film_id = fc.film_id
                      JOIN category AS ca ON fc.category_id = ca.category_id
                      JOIN language as l ON l.language_id = f.language_id
             ORDER BY title`).then(
            (res) => (res.rows)
        ).catch(
            (error) => (console.log(error))
        );
    },
}

app.use('/graphql', graphqlHTTP({
        schema,
        rootValue: root,
        graphiql: true
    })
);

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
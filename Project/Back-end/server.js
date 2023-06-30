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

const schema = buildSchema(fs.readFileSync('schema.graphql', 'utf8'));

const root = {
    getAllFilmsWithCategory: args => {
        return db.query(
            `SELECT f.film_id,
                    f.title as film_title,
                    f.release_year as release_year,
                    f.rating as rating,
                    ca.name as category,
                    l.name as language,
                    f.rental_rate as cost
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
                    f.title as film_title,
                    f.release_year as release_year,
                    f.rating as rating,
                    ca.name as category,
                    l.name as language,
                    f.rental_rate as cost
             FROM film AS f
                      JOIN film_category AS fc ON f.film_id = fc.film_id
                      JOIN category AS ca ON fc.category_id = ca.category_id
                      JOIN language as l ON l.language_id = f.language_id
             WHERE title ILIKE '%${args.filmTitle}%'
             ORDER BY title
             LIMIT ${args.limit} OFFSET ${args.offset}`).then(
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
                    f.title as film_title,
                    f.release_year as release_year,
                    f.length,
                    f.description,
                    f.rating as rating,
                    ca.name as category,
                    l.name as language,
                    f.rental_rate as cost,
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
                    f.title as film_title,
                    f.release_year as release_year,
                    f.rating as rating,
                    ca.name as category,
                    l.name as language,
                    f.rental_rate as cost
             FROM film AS f
                      JOIN film_category AS fc ON f.film_id = fc.film_id
                      JOIN category AS ca ON fc.category_id = ca.category_id
                      JOIN language as l ON l.language_id = f.language_id
             WHERE ca.name = '${args.categoryName}'
             ORDER BY title
             LIMIT ${args.limit} OFFSET ${args.offset}`).then(
            (res) => (res.rows)
        ).catch(
            (error) => (console.log(error))
        );
    },

    getFilmsByCategoryAndTitle: args => {
        return db.query(
            `SELECT f.film_id,
                    f.title as film_title,
                    f.release_year as release_year,
                    f.rating as rating,
                    ca.name as category,
                    l.name as language,
                    f.rental_rate as cost
             FROM film AS f
                      JOIN film_category AS fc ON f.film_id = fc.film_id
                      JOIN category AS ca ON fc.category_id = ca.category_id
                      JOIN language as l ON l.language_id = f.language_id
             WHERE ca.name = '${args.categoryName}'
               AND f.title ILIKE '%${args.filmTitle}%'
             ORDER BY f.title
             LIMIT ${args.limit} OFFSET ${args.offset}`).then(
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
            WHERE inv.film_id=${args.filmId} AND inv.inventory_id  NOT IN (
                SELECT inv.inventory_id
                from inventory as inv
                JOIN rental as re
                ON inv.inventory_id = re.inventory_id
                WHERE inv.film_id = ${args.filmId} and re.return_date is null)`).then(
            (res) => (res.rows)
        ).catch(
            (error) => (console.log(error))
        );
    }
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
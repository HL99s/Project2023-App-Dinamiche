//Express Server
const express = require('express');
const cors = require('cors');
const app = express().use(cors());
//Postgres DB
const {db} = require('./db/connection')
//GraphQL
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


/*
const filmById = (id) => (
    db.query(`SELECT *
              FROM film
              WHERE film_id = ${id}
              ORDER BY film_id`).then(
        (res) => (res.rowCount == 1 ? res.rows[0] : console.log("Sono più di uno"))
    ).catch(
        (error) => (console.log(error))
    )
)

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createFilm: {
            type: FilmType,
            args: {
                title: {type: GraphQLString},
            },
            resolve(parent, args) {

            }
        }
    }
})

const schema = new GraphQLSchema({query: RootQuery, mutation: Mutation})*/

const schema = buildSchema(`
    type Query {
       getAllFilmsWithCategory(offset:Int=0, limit:Int = 10): [Film],
       getFilmsByTitle(offset: Int=0, limit: Int = 10, filmTitle: String): [Film],
       getFilmById(id: Int): Film,
       getFilmInfoById(filmId: Int): Film
       
       getFilmsByCategory(offset:Int=0, limit:Int = 10, categoryName: String): [Film],
       getFilmByCategoryAndTitle(offset: Int=0, limit: Int = 10, filmTitle: String, categoryName: String): [Film],

       getAllStores: [Store],
       getAllCategories: [FilmCategory],
       getFilmActors(filmId: Int): [Actor],

    }
 
    type Film{
        film_id: Int,
        film_title: String,
        release_year: Int,
        rating: String,
        category: String,
        language: String, 
        cost: Float,
        description: String,
        length: Int
    }

    type Actor{
        actor_id: Int,
        first_name: String,
        last_name: String
    }

    type FilmCategory{
        category_id: Int,
        category: String
    }

    type Store{
        store_id: Int,
        address: String,
    }

`);

const root = {
    //ok
    getAllFilmsWithCategory: args => {
        return db.query(
            `SELECT f.film_id, f.title as film_title, f.release_year as release_year, f.rating as rating, ca.name as category, l.name as language, f.rental_rate as cost
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

    //ok
    getFilmsByTitle: args => {
        return db.query(
            `SELECT f.film_id, f.title as film_title, f.release_year as release_year, f.rating as rating, ca.name as category, l.name as language, f.rental_rate as cost
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
            `SELECT f.film_id, f.title as film_title, f.release_year as release_year, f.length, description, f.rating as rating, ca.name as category, l.name as language, f.rental_rate as cost
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

    //ok
    getFilmsByCategory: args => {
        return db.query(
            `SELECT f.film_id, f.title as film_title, f.release_year as release_year, f.rating as rating, ca.name as category, l.name as language, f.rental_rate as cost
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
    //ok
    getFilmByCategoryAndTitle: args => {
        return db.query(
            `SELECT f.film_id, f.title as film_title, f.release_year as release_year, f.rating as rating, ca.name as category, l.name as language, f.rental_rate as cost
            FROM film AS f
            JOIN film_category AS fc ON f.film_id = fc.film_id
            JOIN category AS ca ON fc.category_id = ca.category_id
            JOIN language as l ON l.language_id = f.language_id
            WHERE ca.name = '${args.categoryName}' AND f.title ILIKE '%${args.filmTitle}%'
            ORDER BY f.title
             LIMIT ${args.limit} OFFSET ${args.offset}`).then(
            (res) => (res.rows)
        ).catch(
            (error) => (console.log(error))
        );
    },
    getAllCategories: args => {
        return db.query(
            `SELECT DISTINCT category_id, name as category
             FROM category
             ORDER BY category_id`).then(
            (res) => (res.rows)
        ).catch(
            (error) => (console.log(error))
        );
    },

    getAllStores: args => {
        return db.query(
            `SELECT s.store_id, ad.address
             FROM store AS s
                      JOIN address AS ad
                           ON s.address_id = ad.address_id`).then(
            (res) => (res.rows)
        ).catch(
            (error) => (console.log(error))
        );
    },
    getFilmActors: args => {
        return db.query(
            `SELECT *
             FROM film_actor as fa JOIN actor as act
             ON fa.actor_id = act.actor_id
             WHERE fa.film_id = ${args.filmId}`).then(
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

// route for handling requests from the Angular client
/*
app.get('/api/message', (req, res) => {
    db.query("select * from customer", (err, resd)=>{
        res.json(resd.rows); 
})})*/

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
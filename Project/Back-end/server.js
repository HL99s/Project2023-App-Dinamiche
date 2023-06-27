//Express Server
const express = require('express');
const cors = require('cors');
const app = express().use(cors());
//Postgres DB
const {db} = require('./db/connection')
//GraphQL
const {buildSchema} = require('graphql')
const {graphqlHTTP} = require('express-graphql')

//const { get } = require('https');
//const { throws } = require('assert');

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


/*const FilmType = new GraphQLObjectType({
    name: "Film",
    fields: () => ({
        film_id: {type: GraphQLInt},
        title: {type: GraphQLString},
        description: {type: GraphQLString}
    })
})

const filmList = (offset, limit) => (
    db.query(`SELECT *
              FROM film
              ORDER BY film_id LIMIT ${limit} OFFSET ${offset} `).then(
        (res) => (res.rows)
    ).catch(
        (error) => (console.log(error))
    )
)

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

const filmByCategory = (category) => (

    db.query(`SELECT f.film_id, f.title, f.description, fCat.category_id, cat.name
              FROM (film AS f JOIN film_category AS fCat ON f.film_id = fCat.film_id)
                       JOIN category AS cat ON fCat.category_id = cat.category_id
              WHERE cat.name = '${category}'`).then(
        (res) => (res.rows)
    ).catch(
        (error) => (console.log(error))
    )
)


const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getAllFilm: {
            type: new GraphQLList(FilmType),
            args: {
                offset: {type: GraphQLInt},
                limit: {type: GraphQLInt},
            },
            resolve: function (_, args) {
                return filmList(args.offset, args.limit)
            }
        },
        getById: {
            type: FilmType,
            args: {
                film_id: {type: GraphQLInt},
            },
            resolve: function (_, args) {
                return filmById(args.film_id)
            }
        },
        getByCategory: {
            type: new GraphQLList(FilmType),
            args: {
                cat: {type: GraphQLString},
            },
            resolve: function (_, args) {
                return filmByCategory(args.cat)
            }
        }

    }
})

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
       getAllFilm(offset:Int=0, limit:Int = 10): [Film],
       getFilm(offset: Int=0, limit: Int = 10, filmTitle: String): [Film]
       getAllStore: [Store]

    }
 
    type Film{
        film_id: Int,
        title: String,
        description: String,
    }

    type Store{
        store_id: Int,
        address: String,

    }

`);

const root = {
    getAllFilm: args => {
        return db.query(
            `SELECT *
             FROM film
             ORDER BY rental_rate DESC LIMIT ${args.limit} OFFSET ${args.offset}`).then(
                (res) => (res.rows)
            ).catch(
                (error) => (console.log(error))
            );
            },

    getFilm: args => {
        return db.query(
            `SELECT *
            FROM film
            WHERE title ILIKE '%${args.filmTitle}%'
            ORDER BY rental_rate DESC LIMIT ${args.limit} OFFSET ${args.offset}`).then(
                (res) => (res.rows)
            ).catch(
                (error) => (console.log(error))
            );
            },
    getAllStore: args => {
        return db.query(
            `SELECT s.store_id, ad.address
            FROM store AS s JOIN address AS ad
            ON s.address_id = ad.address_id`).then(
                (res) => (res.rows)
            ).catch(
                (error) => (console.log(error))
            );
            }   
        
    }


app.use('/graphql', graphqlHTTP({
        schema,
        rootValue:root,
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
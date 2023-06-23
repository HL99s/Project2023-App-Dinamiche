//Express Server
const express = require('express');
const cors = require('cors');
const app = express().use(cors());
//Postgres DB
const {db} = require('./db/connection')
//GraphQL
const {GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList} = require('graphql')
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


const FilmType = new GraphQLObjectType({
    name: "Film",
    fields: () => ({
        film_id: {type: GraphQLInt},
        title: {type: GraphQLString},
        description: {type: GraphQLString}
    })
})

const filmList = () => (
    db.query(`SELECT *
              FROM film
              ORDER BY film_id`).then(
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
            resolve() {
                return filmList()
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

const schema = new GraphQLSchema({query: RootQuery, mutation: Mutation})

app.use('/', graphqlHTTP({
        schema,
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
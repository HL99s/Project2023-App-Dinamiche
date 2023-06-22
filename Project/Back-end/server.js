const express = require('express');
const app = express();

const {client} = require('./db/connection')
const graphql = require('graphql')

const {GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList} = graphql
const {graphqlHTTP} = require('express-graphql')

const fs = require('fs');

const {get} = require('https');
const {throws} = require('assert');

const connStr = 'postgresql://postgres@localhost:5432/dvdrental';
const {buildSchema} = graphql


client.connect();


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

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: {type: GraphQLInt},
        firstName: {type: GraphQLString},
        lastName: {type: GraphQLString},
        email: {type: GraphQLString}

    })
})


const filmList = () => (
    client.query("select * from film order by film_id").then((res) => (res.rows)).catch((error) => (console.log(error)))
)

const filmById = (id) => (
    client.query(`select *
                  from film
                  where film_id = ${id}
                  order by film_id`).then((res) => (res.rowCount == 1 ? res.rows[0] : console.log("Sono più di uno"))).catch((error) => (console.log(error)))
)

const filmByCategory = (category) => (
    client.query(`select f.film_id, f.title, f.description, fCat.category_id, cat.name
                  from (film as f
                      JOIN film_category as fCat ON f.film_id = fCat.film_id)
                           JOIN category as cat
                                ON fCat.category_id = cat.category_id
                  WHERE cat.name = ${category}`).then((res) => (res.rows)).catch((error) => (console.log(error)))
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
                name: {type: GraphQLString},

            },
            resolve: function (_, args) {
                console.log(args.name)
                return client.query(`select f.film_id, f.title, f.description, fCat.category_id, cat.name
                                     from (film as f
                                         JOIN film_category as fCat ON f.film_id = fCat.film_id)
                                              JOIN category as cat
                                                   ON fCat.category_id = cat.category_id
                                     WHERE cat.name = ${args.name}`).then((res) => (res.rows)).catch((error) => (console.log(error)))
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
}))

// route for handling requests from the Angular client
/*
app.get('/api/message', (req, res) => {
    client.query("select * from customer", (err, resd)=>{
        res.json(resd.rows); 
})})*/

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
const express = require('express');
const app = express();

const client = require('./db/connection')
const graphql = require('graphql')

const {GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList} = graphql
const {graphqlHTTP}  = require('express-graphql')

const fs = require('fs');

const utenti = require('./MOCK_DATA.json')

const pgPromise = require('pg-promise');
const { get } = require('https');

const connStr = 'postgresql://postgres@localhost:5432/dvdrental'; 

const pgp = pgPromise({}); // empty pgPromise instance
const psql = pgp(connStr); // get connection to your db instance



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
    fields: ()=>({
        id: {type: GraphQLInt},
        firstName: {type: GraphQLString},
        lastName: {type: GraphQLString},
        email: {type: GraphQLString}
       
    })
})


const filmList = ()=>(
    client.query("select * from film").then((valore)=>(valore.rows)).catch((error)=>(console.log(error)))
)

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields:{
        getAllFilm: {
            type: new GraphQLList(FilmType),
            resolve(parent, args){
            
            return filmList()
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields:{
        createFilm: {
            type: FilmType,
            args: {
                title:{type:GraphQLString},
            },
            resolve(parent, args) {
                
            }
        }
    }
})

const schema = new GraphQLSchema({query: RootQuery, mutation: Mutation})

app.use('/graphql', graphqlHTTP({
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
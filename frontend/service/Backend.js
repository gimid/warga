import {Client, Databases, Teams, Query, Storage, Functions} from 'appwrite'

const client = new Client()
  .setEndpoint( process.env.APPWRITE_ENDPOINT)
  .setProject( process.env.APPWRITE_PROJECT )

const databases = new Databases(client)
const storage = new Storage(client);
const teams = new Teams(client)
const functions = new Functions(client);

export {client, databases, teams, functions, storage}
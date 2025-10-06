import { MongoClient, MongoClientOptions } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

// if (!process.env.MONGODB_URI) {
//   throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
// }

// const uri = process.env.MONGODB_URI;
// const options: MongoClientOptions = { appName: "devrel.vercel.integration" };

// let client: MongoClient;
// let globalWithMongo = global as typeof globalThis & {
//   _mongoClient?: MongoClient;
// };
// if (process.env.NODE_ENV === "development") {
//   if (!globalWithMongo._mongoClient) {
//     globalWithMongo._mongoClient = new MongoClient(uri, options);
//   }
//   client = globalWithMongo._mongoClient;
// } else {
//   client = new MongoClient(uri, options);
//   attachDatabasePool(client);
// }

// // Export a module-scoped MongoClient. By doing this in a
// // separate module, the client can be shared across functions.

// export default client;

export default async function Mongo_client_Component(): Promise<MongoClient> {
  if (!process.env.MONGODB_MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_MONGODB_URI"');
  }
  const uri = process.env.MONGODB_MONGODB_URI;
  const options: MongoClientOptions = { appName: "devrel.vercel.integration" };
  let client: MongoClient;
  let globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };
  if (process.env.NODE_ENV === "development") {
    if (!globalWithMongo._mongoClient) {
      globalWithMongo._mongoClient = new MongoClient(uri, options);
    }
    client = globalWithMongo._mongoClient;
  } else {
    client = new MongoClient(uri, options);
    attachDatabasePool(client);
  }

  return client;
}
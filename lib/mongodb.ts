import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB ?? "kapriz";

const globalForMongo = globalThis as unknown as {
  mongoClient?: Promise<MongoClient>;
};

export function mongoClient(): Promise<MongoClient> {
  if (!globalForMongo.mongoClient) {
    globalForMongo.mongoClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
    }).connect();
  }
  return globalForMongo.mongoClient;
}

export async function getDb(): Promise<Db> {
  const client = await mongoClient();
  return client.db(dbName);
}

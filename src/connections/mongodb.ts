import mongoose from 'mongoose';

const url: any = process.env.URL_CLUSTER;

export const db = mongoose.createConnection(url);

db.on('connected', () => console.log('🔥 DB connected'));
db.on('open', () => console.log('🔥 DB open'));
db.on('disconnected', () => console.log('disconnected'));
db.on('reconnected', () => console.log('reconnected'));
db.on('disconnecting', () => console.log('disconnecting'));
db.on('close', () => console.log('close'));

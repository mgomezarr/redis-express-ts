import axios from 'axios'
import express from 'express';
import * as redis from 'redis';
import { Request, Response } from "express";

const client = redis.createClient();

client.on('error', (err) => {
    console.log('Redis Client Error', err)
});

const app = express();

app.get('/', async (req: Request, res: Response) => {
    if (!client.isOpen) {
        await client.connect();
    }
    let response: any = await client.get('characters');
    if (response) {
        return res.json(JSON.parse(response));
    }
    response = await axios.get('https://rickandmortyapi.com/api/character');
    client.set('characters', JSON.stringify(response.data));
    return res.json(response.data);
});

app.listen(3000, () => {
    console.log('Server on port 3000');
});
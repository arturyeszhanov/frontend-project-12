// backend/index.js
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const buildPath = path.join(__dirname, '..', 'frontend', 'dist');

const fastify = Fastify({ logger: true });

fastify.register(fastifyStatic, {
  root: buildPath,
});

fastify.setNotFoundHandler((request, reply) => {
  reply.type('text/html').sendFile('index.html');
});

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    console.log('Server running...');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

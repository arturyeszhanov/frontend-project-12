// index.js
const path = require('path');
const fastify = require('fastify')({ logger: true });
const fastifyStatic = require('@fastify/static');

const buildPath = path.join(__dirname, 'frontend', 'dist');

fastify.register(fastifyStatic, {
  root: buildPath,
  wildcard: false,
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

require('dotenv').config();
const Fastify = require('fastify');
const cors = require('@fastify/cors');
const multipart = require('@fastify/multipart');
const sensible = require('@fastify/sensible');
const config = require('./config');
const prismaPlugin = require('./plugins/prisma');
const storagePlugin = require('./plugins/storage');
const healthRoutes = require('./routes/health');
const memberRoutes = require('./routes/members');
const uploadRoutes = require('./routes/uploads');

async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: config.logLevel,
    },
  });

  await fastify.register(sensible);
  await fastify.register(cors, { origin: true });
  await fastify.register(multipart, { attachFieldsToBody: false });
  await fastify.register(prismaPlugin);
  await fastify.register(storagePlugin);

  await fastify.register(healthRoutes);
  await fastify.register(uploadRoutes);
  await fastify.register(memberRoutes);

  return fastify;
}

async function start() {
  const fastify = await buildServer();
  try {
    await fastify.listen({ port: config.port, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();

module.exports = { buildServer };

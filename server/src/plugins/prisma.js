const fp = require('fastify-plugin');
const { PrismaClient } = require('@prisma/client');
const config = require('../config');

async function prismaPlugin(fastify) {
  const prisma = new PrismaClient({
    datasources: { db: { url: config.databaseUrl } },
    log: ['error', 'warn'],
  });

  await prisma.$connect();
  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async (app) => {
    await app.prisma.$disconnect();
  });
}

module.exports = fp(prismaPlugin);

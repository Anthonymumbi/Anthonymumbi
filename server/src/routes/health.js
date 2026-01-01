module.exports = async function healthRoutes(fastify) {
  fastify.get('/health', async () => ({ status: 'ok' }));
};

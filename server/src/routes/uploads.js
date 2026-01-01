const { z } = require('zod');
const config = require('../config');

const presignBodySchema = z.object({
  contentType: z.string().min(1),
  contentLength: z.number().int().positive(),
});

module.exports = async function uploadRoutes(fastify) {
  fastify.post('/api/uploads/presign', async (request) => {
    const body = presignBodySchema.parse(request.body ?? {});

    const result = await fastify.storage.presignUpload(body);

    return {
      uploadUrl: result.uploadUrl,
      key: result.key,
      expiresIn: result.expiresIn,
      maxUploadBytes: config.s3.maxUploadBytes,
    };
  });
};

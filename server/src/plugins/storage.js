const { randomUUID } = require('crypto');
const fp = require('fastify-plugin');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const config = require('../config');

function createS3Client() {
  if (!config.s3.bucket || !config.s3.accessKeyId || !config.s3.secretAccessKey) {
    return null;
  }

  return new S3Client({
    region: config.s3.region,
    endpoint: config.s3.endpoint,
    forcePathStyle: Boolean(config.s3.endpoint),
    credentials: {
      accessKeyId: config.s3.accessKeyId,
      secretAccessKey: config.s3.secretAccessKey,
    },
  });
}

async function presignUpload(s3Client, { contentType, contentLength }) {
  const key = `uploads/${new Date().toISOString().slice(0, 10)}/${randomUUID()}`;

  const command = new PutObjectCommand({
    Bucket: config.s3.bucket,
    Key: key,
    ContentType: contentType,
    ACL: config.s3.acl,
    ContentLength: contentLength,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: config.s3.presignExpiresSeconds,
  });

  return { uploadUrl, key, expiresIn: config.s3.presignExpiresSeconds }; 
}

async function storagePlugin(fastify) {
  const s3Client = createS3Client();

  fastify.decorate('storage', {
    hasStorage: Boolean(s3Client),
    presignUpload: async (options) => {
      if (!s3Client) {
        throw fastify.httpErrors.serviceUnavailable('Storage is not configured');
      }
      if (options.contentLength > config.s3.maxUploadBytes) {
        throw fastify.httpErrors.payloadTooLarge('File size exceeds limit');
      }
      return presignUpload(s3Client, options);
    },
  });
}

module.exports = fp(storagePlugin);

const config = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'production',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/movement?schema=public',
  logLevel: process.env.LOG_LEVEL || 'info',
  s3: {
    endpoint: process.env.S3_ENDPOINT || undefined,
    region: process.env.S3_REGION || 'auto',
    bucket: process.env.S3_BUCKET || undefined,
    accessKeyId: process.env.S3_ACCESS_KEY || undefined,
    secretAccessKey: process.env.S3_SECRET_KEY || undefined,
    presignExpiresSeconds: Number(process.env.S3_PRESIGN_TTL || 900),
    maxUploadBytes: Number(process.env.MAX_UPLOAD_BYTES || 5 * 1024 * 1024),
    acl: process.env.S3_ACL || 'private',
  },
};

module.exports = config;

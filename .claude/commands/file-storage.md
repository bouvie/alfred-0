# file-storage

## Stack
MinIO (dev, Docker) · Cloudflare R2 (prod) · AWS SDK v3 `@aws-sdk/client-s3` (same code both envs)
Images: Sharp · CDN: Cloudflare (included with R2)

## S3 client

```typescript
new S3Client({
  region: 'auto',
  endpoint: config.get('S3_ENDPOINT'),
  credentials: { accessKeyId: config.get('S3_ACCESS_KEY'), secretAccessKey: config.get('S3_SECRET_KEY') },
  forcePathStyle: config.get('S3_FORCE_PATH_STYLE') === 'true',  // true: MinIO · false: R2
})
```

`@Global()` module, injected as `S3_CLIENT` token.

## Upload strategy

**Presigned URL (files > 1MB)** — NestJS never buffers binary:
```
POST /files/upload-url → { uploadUrl, key }
PUT uploadUrl (client → S3 directly)
POST /files/confirm { key } → { fileId }
```

**Server-side upload (files < 1MB or image transformation needed)**:
```typescript
await s3.send(new PutObjectCommand({ Bucket, Key: key, Body: buffer, ContentType }));
```

## Key convention

`<tenantId>/<category>/<cuid><ext>` — never original filename (path traversal risk).

## Validation

```typescript
ALLOWED_TYPES = { avatars: ['image/jpeg','image/png','image/webp'], documents: ['application/pdf'] }
MAX_SIZE = { avatars: 2_000_000, documents: 20_000_000 }
```

Server-side only — never trust client-side validation.

## Confirm endpoint rules

```typescript
if (!dto.key.startsWith(`${user.tenantId}/`)) throw new ForbiddenException();
await s3.send(new HeadObjectCommand({ Bucket, Key: dto.key })); // assert file exists
```

## Image processing (Sharp)

```typescript
await sharp(buffer).resize(256, 256, { fit: 'cover' }).webp({ quality: 85 }).toBuffer()
```

Always convert to WebP on upload. Original → stored as-is. Variants → WebP.

## Angular upload component

1. `POST /files/upload-url` → presigned URL + key
2. `XMLHttpRequest.upload.onprogress` → `progress` signal
3. `PUT presignedUrl` with raw file
4. `POST /files/confirm` → file record

## Docker dev

```yaml
minio: { image: minio/minio, command: server /data --console-address ":9001", ports: ["9000:9000","9001:9001"] }
minio-init: # mc mb --ignore-existing local/app-dev
```

## Env vars

```env
S3_ENDPOINT=http://localhost:9000         # MinIO dev
S3_ENDPOINT=https://<id>.r2.cloudflarestorage.com  # R2 prod
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_BUCKET=app-dev
S3_FORCE_PATH_STYLE=true   # MinIO only
```

## Rules
- Presigned URL for everything > 1MB
- Confirm endpoint: verify existence + tenant ownership
- Private by default. `public/` prefix only for intentionally public assets.
- Weekly BullMQ CRON: delete bucket objects with no matching DB record (orphan cleanup)

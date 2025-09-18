-- CreateEnum
CREATE TYPE "public"."FieldType" AS ENUM ('TEXT', 'EMAIL', 'PHONE', 'TEXTAREA', 'RADIO', 'CHECKBOX', 'SELECT', 'NUMBER', 'RATING', 'DATE', 'TIME', 'FILE');

-- CreateTable
CREATE TABLE "public"."form" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Untitled form',
    "description" TEXT DEFAULT 'Form description',
    "slug" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "estimatedTime" TEXT DEFAULT '5-7 minutes',
    "theme" JSONB,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."field" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "type" "public"."FieldType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "placeholder" TEXT,
    "options" JSONB,
    "min" DOUBLE PRECISION,
    "max" DOUBLE PRECISION,
    "step" DOUBLE PRECISION,
    "rows" INTEGER,
    "acceptedTypes" TEXT,
    "maxFileSize" INTEGER,
    "minDate" TEXT,
    "maxDate" TEXT,
    "minTime" TEXT,
    "maxTime" TEXT,
    "maxRating" INTEGER DEFAULT 5,
    "validation" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."response" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "submitterIp" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "response_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "form_slug_key" ON "public"."form"("slug");

-- AddForeignKey
ALTER TABLE "public"."form" ADD CONSTRAINT "form_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."field" ADD CONSTRAINT "field_formId_fkey" FOREIGN KEY ("formId") REFERENCES "public"."form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."response" ADD CONSTRAINT "response_formId_fkey" FOREIGN KEY ("formId") REFERENCES "public"."form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

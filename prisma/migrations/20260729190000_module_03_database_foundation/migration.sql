-- CreateEnum
CREATE TYPE "QuotationUrgency" AS ENUM ('ROUTINE', 'URGENT', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "QuotationItemStatus" AS ENUM ('PENDING_IDENTIFICATION', 'IDENTIFIED', 'NEEDS_REVIEW', 'UNAVAILABLE', 'PRICED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SENT', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EmailProvider" AS ENUM ('GOOGLE', 'OTHER');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('HEADQUARTERS', 'BILLING', 'SHIPPING', 'OTHER');

-- CreateEnum
CREATE TYPE "UnitOfMeasure" AS ENUM ('UNIT', 'PAIR', 'KIT', 'BOX', 'PACKAGE', 'CENTIMETER', 'METER');

-- CreateEnum
CREATE TYPE "CurrencyCode" AS ENUM ('BRL', 'USD', 'EUR');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "QuotationStatus" ADD VALUE 'RECEIVED';
ALTER TYPE "QuotationStatus" ADD VALUE 'UNDER_REVIEW';
ALTER TYPE "QuotationStatus" ADD VALUE 'MATERIALS_PENDING';
ALTER TYPE "QuotationStatus" ADD VALUE 'PRICING_PENDING';
ALTER TYPE "QuotationStatus" ADD VALUE 'READY_FOR_APPROVAL';
ALTER TYPE "QuotationStatus" ADD VALUE 'APPROVED';
ALTER TYPE "QuotationStatus" ADD VALUE 'REJECTED';
ALTER TYPE "QuotationStatus" ADD VALUE 'SENT';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EmailStatus" ADD VALUE 'PENDING';
ALTER TYPE "EmailStatus" ADD VALUE 'PROCESSING';
ALTER TYPE "EmailStatus" ADD VALUE 'PROCESSED';
ALTER TYPE "EmailStatus" ADD VALUE 'FAILED';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditAction" ADD VALUE 'ENTITY_CREATED';
ALTER TYPE "AuditAction" ADD VALUE 'ENTITY_UPDATED';
ALTER TYPE "AuditAction" ADD VALUE 'ENTITY_DEACTIVATED';

-- DropIndex
DROP INDEX "EmailMessage_externalId_key";

-- DropIndex
DROP INDEX "QuotationRequest_code_key";

-- DropIndex
DROP INDEX "QuotationRequest_status_idx";

-- DropIndex
DROP INDEX "QuotationItem_quotationRequestId_idx";

-- DropIndex
DROP INDEX "Hospital_document_key";

-- DropIndex
DROP INDEX "Insurance_code_key";

-- DropIndex
DROP INDEX "Supplier_document_key";

-- DropIndex
DROP INDEX "Material_code_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "organizationId" TEXT;

-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "after" JSONB,
ADD COLUMN     "before" JSONB,
ADD COLUMN     "organizationId" TEXT;

-- AlterTable
ALTER TABLE "EmailMessage" ADD COLUMN     "bodyHtml" TEXT,
ADD COLUMN     "bodyText" TEXT,
ADD COLUMN     "hasAttachments" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "processedAt" TIMESTAMP(3),
ADD COLUMN     "provider" "EmailProvider" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "providerThreadId" TEXT,
ADD COLUMN     "recipients" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "QuotationRequest" ADD COLUMN     "assignedToUserId" TEXT,
ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "dueAt" TIMESTAMP(3),
ADD COLUMN     "externalReference" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "patientReference" TEXT,
ADD COLUMN     "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "requestingDoctor" TEXT,
ADD COLUMN     "surgeryDate" TIMESTAMP(3),
ADD COLUMN     "urgency" "QuotationUrgency" NOT NULL DEFAULT 'ROUTINE',
ALTER COLUMN "status" SET DEFAULT 'RECEIVED';

-- AlterTable
ALTER TABLE "QuotationItem" ADD COLUMN     "extractionConfidence" DECIMAL(5,4),
ADD COLUMN     "matchingConfidence" DECIMAL(5,4),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "status" "QuotationItemStatus" NOT NULL DEFAULT 'PENDING_IDENTIFICATION',
ADD COLUMN     "supplierMaterialId" TEXT,
ADD COLUMN     "unitOfMeasure" "UnitOfMeasure" NOT NULL DEFAULT 'UNIT';

-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "email" TEXT,
ADD COLUMN     "internalCode" TEXT,
ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "tradeName" TEXT;

-- AlterTable
ALTER TABLE "Insurance" ADD COLUMN     "document" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "email" TEXT,
ADD COLUMN     "internalCode" TEXT,
ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "tradeName" TEXT;

-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "anvisaExpirationDate" TIMESTAMP(3),
ADD COLUMN     "anvisaRegistration" TEXT,
ADD COLUMN     "brandId" TEXT,
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "manufacturerCode" TEXT,
ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "technicalDescription" TEXT,
ADD COLUMN     "unitOfMeasure" "UnitOfMeasure" NOT NULL DEFAULT 'UNIT';

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "tradeName" TEXT,
    "document" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HospitalAddress" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "type" "AddressType" NOT NULL DEFAULT 'OTHER',
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'BR',
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HospitalAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HospitalInsurance" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "insuranceId" TEXT NOT NULL,
    "externalCode" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HospitalInsurance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierAddress" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "type" "AddressType" NOT NULL DEFAULT 'OTHER',
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'BR',
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manufacturer" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "document" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manufacturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialCategory" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parentId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaterialCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierMaterial" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "supplierCode" TEXT NOT NULL,
    "purchasePrice" DECIMAL(18,4) NOT NULL,
    "currency" "CurrencyCode" NOT NULL DEFAULT 'BRL',
    "minimumQuantity" INTEGER NOT NULL DEFAULT 1,
    "leadTimeDays" INTEGER,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailAttachment" (
    "id" TEXT NOT NULL,
    "emailMessageId" TEXT NOT NULL,
    "providerAttachmentId" TEXT,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "storageKey" TEXT,
    "checksum" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationProposal" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "quotationRequestId" TEXT NOT NULL,
    "proposalNumber" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" "ProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "subtotal" DECIMAL(18,4) NOT NULL,
    "taxes" DECIMAL(18,4) NOT NULL,
    "logisticsCost" DECIMAL(18,4) NOT NULL,
    "additionalCost" DECIMAL(18,4) NOT NULL,
    "discount" DECIMAL(18,4) NOT NULL,
    "total" DECIMAL(18,4) NOT NULL,
    "minimumMarginPercent" DECIMAL(7,4) NOT NULL,
    "actualMarginPercent" DECIMAL(7,4) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "approvedByUserId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuotationProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationProposalItem" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "quotationItemId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "supplierId" TEXT,
    "quantity" DECIMAL(12,3) NOT NULL,
    "unitCost" DECIMAL(18,4) NOT NULL,
    "logisticsCost" DECIMAL(18,4) NOT NULL,
    "taxCost" DECIMAL(18,4) NOT NULL,
    "additionalCost" DECIMAL(18,4) NOT NULL,
    "minimumUnitPrice" DECIMAL(18,4) NOT NULL,
    "proposedUnitPrice" DECIMAL(18,4) NOT NULL,
    "totalCost" DECIMAL(18,4) NOT NULL,
    "totalPrice" DECIMAL(18,4) NOT NULL,
    "marginPercent" DECIMAL(7,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuotationProposalItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationStatusHistory" (
    "id" TEXT NOT NULL,
    "quotationRequestId" TEXT NOT NULL,
    "previousStatus" "QuotationStatus",
    "newStatus" "QuotationStatus" NOT NULL,
    "changedByUserId" TEXT,
    "reason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuotationStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalStatusHistory" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "previousStatus" "ProposalStatus",
    "newStatus" "ProposalStatus" NOT NULL,
    "changedByUserId" TEXT,
    "reason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProposalStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_document_key" ON "Organization"("document");

-- CreateIndex
CREATE INDEX "Organization_active_idx" ON "Organization"("active");

-- CreateIndex
CREATE INDEX "Organization_createdAt_idx" ON "Organization"("createdAt");

-- CreateIndex
CREATE INDEX "HospitalAddress_hospitalId_primary_idx" ON "HospitalAddress"("hospitalId", "primary");

-- CreateIndex
CREATE INDEX "HospitalInsurance_insuranceId_active_idx" ON "HospitalInsurance"("insuranceId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "HospitalInsurance_hospitalId_insuranceId_key" ON "HospitalInsurance"("hospitalId", "insuranceId");

-- CreateIndex
CREATE INDEX "SupplierAddress_supplierId_primary_idx" ON "SupplierAddress"("supplierId", "primary");

-- CreateIndex
CREATE INDEX "Manufacturer_organizationId_active_idx" ON "Manufacturer"("organizationId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "Manufacturer_organizationId_name_key" ON "Manufacturer"("organizationId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Manufacturer_organizationId_document_key" ON "Manufacturer"("organizationId", "document");

-- CreateIndex
CREATE INDEX "Brand_active_idx" ON "Brand"("active");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_manufacturerId_name_key" ON "Brand"("manufacturerId", "name");

-- CreateIndex
CREATE INDEX "MaterialCategory_organizationId_active_idx" ON "MaterialCategory"("organizationId", "active");

-- CreateIndex
CREATE INDEX "MaterialCategory_parentId_idx" ON "MaterialCategory"("parentId");

-- CreateIndex
CREATE INDEX "SupplierMaterial_supplierId_active_idx" ON "SupplierMaterial"("supplierId", "active");

-- CreateIndex
CREATE INDEX "SupplierMaterial_materialId_active_idx" ON "SupplierMaterial"("materialId", "active");

-- CreateIndex
CREATE INDEX "SupplierMaterial_validFrom_validUntil_idx" ON "SupplierMaterial"("validFrom", "validUntil");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierMaterial_supplierId_materialId_supplierCode_validFr_key" ON "SupplierMaterial"("supplierId", "materialId", "supplierCode", "validFrom");

-- CreateIndex
CREATE INDEX "EmailAttachment_emailMessageId_idx" ON "EmailAttachment"("emailMessageId");

-- CreateIndex
CREATE INDEX "QuotationProposal_organizationId_status_idx" ON "QuotationProposal"("organizationId", "status");

-- CreateIndex
CREATE INDEX "QuotationProposal_quotationRequestId_idx" ON "QuotationProposal"("quotationRequestId");

-- CreateIndex
CREATE INDEX "QuotationProposal_createdByUserId_idx" ON "QuotationProposal"("createdByUserId");

-- CreateIndex
CREATE INDEX "QuotationProposal_createdAt_idx" ON "QuotationProposal"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "QuotationProposal_organizationId_proposalNumber_key" ON "QuotationProposal"("organizationId", "proposalNumber");

-- CreateIndex
CREATE UNIQUE INDEX "QuotationProposal_quotationRequestId_version_key" ON "QuotationProposal"("quotationRequestId", "version");

-- CreateIndex
CREATE INDEX "QuotationProposalItem_materialId_idx" ON "QuotationProposalItem"("materialId");

-- CreateIndex
CREATE INDEX "QuotationProposalItem_supplierId_idx" ON "QuotationProposalItem"("supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "QuotationProposalItem_proposalId_quotationItemId_key" ON "QuotationProposalItem"("proposalId", "quotationItemId");

-- CreateIndex
CREATE INDEX "QuotationStatusHistory_quotationRequestId_createdAt_idx" ON "QuotationStatusHistory"("quotationRequestId", "createdAt");

-- CreateIndex
CREATE INDEX "QuotationStatusHistory_changedByUserId_idx" ON "QuotationStatusHistory"("changedByUserId");

-- CreateIndex
CREATE INDEX "ProposalStatusHistory_proposalId_createdAt_idx" ON "ProposalStatusHistory"("proposalId", "createdAt");

-- CreateIndex
CREATE INDEX "ProposalStatusHistory_changedByUserId_idx" ON "ProposalStatusHistory"("changedByUserId");

-- CreateIndex
CREATE INDEX "User_organizationId_idx" ON "User"("organizationId");

-- CreateIndex
CREATE INDEX "AuditLog_organizationId_createdAt_idx" ON "AuditLog"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "EmailMessage_organizationId_status_idx" ON "EmailMessage"("organizationId", "status");

-- CreateIndex
CREATE INDEX "EmailMessage_externalId_idx" ON "EmailMessage"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailMessage_organizationId_provider_externalId_key" ON "EmailMessage"("organizationId", "provider", "externalId");

-- CreateIndex
CREATE INDEX "QuotationRequest_organizationId_status_idx" ON "QuotationRequest"("organizationId", "status");

-- CreateIndex
CREATE INDEX "QuotationRequest_hospitalId_idx" ON "QuotationRequest"("hospitalId");

-- CreateIndex
CREATE INDEX "QuotationRequest_insuranceId_idx" ON "QuotationRequest"("insuranceId");

-- CreateIndex
CREATE INDEX "QuotationRequest_receivedAt_idx" ON "QuotationRequest"("receivedAt");

-- CreateIndex
CREATE INDEX "QuotationRequest_dueAt_idx" ON "QuotationRequest"("dueAt");

-- CreateIndex
CREATE INDEX "QuotationRequest_assignedToUserId_idx" ON "QuotationRequest"("assignedToUserId");

-- CreateIndex
CREATE INDEX "QuotationRequest_emailMessageId_idx" ON "QuotationRequest"("emailMessageId");

-- CreateIndex
CREATE UNIQUE INDEX "QuotationRequest_organizationId_code_key" ON "QuotationRequest"("organizationId", "code");

-- CreateIndex
CREATE INDEX "QuotationItem_quotationRequestId_status_idx" ON "QuotationItem"("quotationRequestId", "status");

-- CreateIndex
CREATE INDEX "QuotationItem_materialId_idx" ON "QuotationItem"("materialId");

-- CreateIndex
CREATE INDEX "QuotationItem_supplierId_idx" ON "QuotationItem"("supplierId");

-- CreateIndex
CREATE INDEX "QuotationItem_supplierMaterialId_idx" ON "QuotationItem"("supplierMaterialId");

-- CreateIndex
CREATE INDEX "Hospital_organizationId_active_idx" ON "Hospital"("organizationId", "active");

-- CreateIndex
CREATE INDEX "Hospital_createdAt_idx" ON "Hospital"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_organizationId_document_key" ON "Hospital"("organizationId", "document");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_organizationId_internalCode_key" ON "Hospital"("organizationId", "internalCode");

-- CreateIndex
CREATE INDEX "Insurance_organizationId_active_idx" ON "Insurance"("organizationId", "active");

-- CreateIndex
CREATE INDEX "Insurance_createdAt_idx" ON "Insurance"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Insurance_organizationId_code_key" ON "Insurance"("organizationId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Insurance_organizationId_document_key" ON "Insurance"("organizationId", "document");

-- CreateIndex
CREATE INDEX "Supplier_organizationId_active_idx" ON "Supplier"("organizationId", "active");

-- CreateIndex
CREATE INDEX "Supplier_createdAt_idx" ON "Supplier"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_organizationId_document_key" ON "Supplier"("organizationId", "document");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_organizationId_internalCode_key" ON "Supplier"("organizationId", "internalCode");

-- CreateIndex
CREATE INDEX "Material_organizationId_active_idx" ON "Material"("organizationId", "active");

-- CreateIndex
CREATE INDEX "Material_categoryId_idx" ON "Material"("categoryId");

-- CreateIndex
CREATE INDEX "Material_brandId_idx" ON "Material"("brandId");

-- CreateIndex
CREATE INDEX "Material_createdAt_idx" ON "Material"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Material_organizationId_code_key" ON "Material"("organizationId", "code");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalAddress" ADD CONSTRAINT "HospitalAddress_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insurance" ADD CONSTRAINT "Insurance_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalInsurance" ADD CONSTRAINT "HospitalInsurance_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalInsurance" ADD CONSTRAINT "HospitalInsurance_insuranceId_fkey" FOREIGN KEY ("insuranceId") REFERENCES "Insurance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierAddress" ADD CONSTRAINT "SupplierAddress_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manufacturer" ADD CONSTRAINT "Manufacturer_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialCategory" ADD CONSTRAINT "MaterialCategory_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialCategory" ADD CONSTRAINT "MaterialCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "MaterialCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MaterialCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierMaterial" ADD CONSTRAINT "SupplierMaterial_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierMaterial" ADD CONSTRAINT "SupplierMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailMessage" ADD CONSTRAINT "EmailMessage_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailAttachment" ADD CONSTRAINT "EmailAttachment_emailMessageId_fkey" FOREIGN KEY ("emailMessageId") REFERENCES "EmailMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationRequest" ADD CONSTRAINT "QuotationRequest_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationRequest" ADD CONSTRAINT "QuotationRequest_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationItem" ADD CONSTRAINT "QuotationItem_supplierMaterialId_fkey" FOREIGN KEY ("supplierMaterialId") REFERENCES "SupplierMaterial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationProposal" ADD CONSTRAINT "QuotationProposal_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationProposal" ADD CONSTRAINT "QuotationProposal_quotationRequestId_fkey" FOREIGN KEY ("quotationRequestId") REFERENCES "QuotationRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationProposal" ADD CONSTRAINT "QuotationProposal_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationProposal" ADD CONSTRAINT "QuotationProposal_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationProposalItem" ADD CONSTRAINT "QuotationProposalItem_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "QuotationProposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationProposalItem" ADD CONSTRAINT "QuotationProposalItem_quotationItemId_fkey" FOREIGN KEY ("quotationItemId") REFERENCES "QuotationItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationProposalItem" ADD CONSTRAINT "QuotationProposalItem_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationProposalItem" ADD CONSTRAINT "QuotationProposalItem_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationStatusHistory" ADD CONSTRAINT "QuotationStatusHistory_quotationRequestId_fkey" FOREIGN KEY ("quotationRequestId") REFERENCES "QuotationRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationStatusHistory" ADD CONSTRAINT "QuotationStatusHistory_changedByUserId_fkey" FOREIGN KEY ("changedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalStatusHistory" ADD CONSTRAINT "ProposalStatusHistory_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "QuotationProposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalStatusHistory" ADD CONSTRAINT "ProposalStatusHistory_changedByUserId_fkey" FOREIGN KEY ("changedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- Domain invariants that Prisma cannot currently express.
ALTER TABLE "SupplierMaterial" ADD CONSTRAINT "SupplierMaterial_validity_check" CHECK ("validUntil" > "validFrom");
ALTER TABLE "SupplierMaterial" ADD CONSTRAINT "SupplierMaterial_price_check" CHECK ("purchasePrice" >= 0 AND "minimumQuantity" > 0 AND ("leadTimeDays" IS NULL OR "leadTimeDays" >= 0));
ALTER TABLE "QuotationItem" ADD CONSTRAINT "QuotationItem_quantity_check" CHECK ("quantity" > 0);
ALTER TABLE "QuotationItem" ADD CONSTRAINT "QuotationItem_extraction_confidence_check" CHECK ("extractionConfidence" IS NULL OR ("extractionConfidence" >= 0 AND "extractionConfidence" <= 1));
ALTER TABLE "QuotationItem" ADD CONSTRAINT "QuotationItem_matching_confidence_check" CHECK ("matchingConfidence" IS NULL OR ("matchingConfidence" >= 0 AND "matchingConfidence" <= 1));
ALTER TABLE "QuotationProposal" ADD CONSTRAINT "QuotationProposal_financials_check" CHECK ("subtotal" >= 0 AND "taxes" >= 0 AND "logisticsCost" >= 0 AND "additionalCost" >= 0 AND "discount" >= 0 AND "total" >= 0 AND "version" > 0);
ALTER TABLE "QuotationProposalItem" ADD CONSTRAINT "QuotationProposalItem_financials_check" CHECK ("quantity" > 0 AND "unitCost" >= 0 AND "logisticsCost" >= 0 AND "taxCost" >= 0 AND "additionalCost" >= 0 AND "minimumUnitPrice" >= 0 AND "proposedUnitPrice" >= 0 AND "totalCost" >= 0 AND "totalPrice" >= 0);

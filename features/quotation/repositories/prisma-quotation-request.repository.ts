import { Prisma, type PrismaClient } from "@prisma/client";
import { PrismaRepository } from "@/repositories/structural.repository";
import type { QuotationRequestInput } from "../validators";
import type { QuotationRequestRepository } from "./quotation-request.repository";
export class PrismaQuotationRequestRepository
  extends PrismaRepository
  implements QuotationRequestRepository
{
  constructor(db: PrismaClient) {
    super(db);
  }
  findById(id: string) {
    return this.db.quotationRequest.findUnique({
      where: { id },
      include: { items: true },
    });
  }
  findMany(organizationId: string) {
    return this.db.quotationRequest.findMany({
      where: { organizationId },
      orderBy: { receivedAt: "desc" },
    });
  }
  findByNumber(organizationId: string, requestNumber: string) {
    return this.db.quotationRequest.findFirst({
      where: { organizationId, requestNumber },
    });
  }
  create({ items, ...input }: QuotationRequestInput) {
    return this.db.quotationRequest.create({
      data: {
        ...input,
        items: {
          create: items.map((i) => ({
            ...i,
            extractionConfidence:
              i.extractionConfidence === undefined
                ? undefined
                : new Prisma.Decimal(i.extractionConfidence),
            matchingConfidence:
              i.matchingConfidence === undefined
                ? undefined
                : new Prisma.Decimal(i.matchingConfidence),
          })),
        },
      },
    });
  }
  update(id: string, input: Record<string, unknown>) {
    return this.db.quotationRequest.update({ where: { id }, data: input });
  }
  deactivate(id: string, cancellationReason: string) {
    return this.db.quotationRequest.update({
      where: { id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancellationReason,
      },
    });
  }
}

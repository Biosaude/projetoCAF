import { Prisma, type PrismaClient } from "@prisma/client";
import { PrismaRepository } from "@/repositories/structural.repository";
import type { QuotationProposalInput } from "../validators";
import type { QuotationProposalRepository } from "./quotation-proposal.repository";
const decimal = (v: string | number) => new Prisma.Decimal(v);
export class PrismaQuotationProposalRepository
  extends PrismaRepository
  implements QuotationProposalRepository
{
  constructor(db: PrismaClient) {
    super(db);
  }
  findById(id: string) {
    return this.db.quotationProposal.findUnique({
      where: { id },
      include: { items: true },
    });
  }
  findMany(organizationId: string) {
    return this.db.quotationProposal.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });
  }
  findDuplicate(
    organizationId: string,
    proposalNumber: string,
    quotationRequestId: string,
    version: number,
  ) {
    return this.db.quotationProposal.findFirst({
      where: {
        OR: [
          { organizationId, proposalNumber },
          { quotationRequestId, version },
        ],
      },
    });
  }
  create({ items, ...i }: QuotationProposalInput) {
    return this.db.quotationProposal.create({
      data: {
        ...i,
        subtotal: decimal(i.subtotal),
        taxes: decimal(i.taxes),
        logisticsCost: decimal(i.logisticsCost),
        additionalCost: decimal(i.additionalCost),
        discount: decimal(i.discount),
        total: decimal(i.total),
        minimumMarginPercent: decimal(i.minimumMarginPercent),
        actualMarginPercent: decimal(i.actualMarginPercent),
        items: {
          create: items.map((x) => ({
            ...x,
            quantity: decimal(x.quantity),
            unitCost: decimal(x.unitCost),
            logisticsCost: decimal(x.logisticsCost),
            taxCost: decimal(x.taxCost),
            additionalCost: decimal(x.additionalCost),
            minimumUnitPrice: decimal(x.minimumUnitPrice),
            proposedUnitPrice: decimal(x.proposedUnitPrice),
            totalCost: decimal(x.totalCost),
            totalPrice: decimal(x.totalPrice),
            marginPercent: decimal(x.marginPercent),
          })),
        },
      },
    });
  }
  update(id: string, input: Record<string, unknown>) {
    return this.db.quotationProposal.update({ where: { id }, data: input });
  }
  deactivate(id: string) {
    return this.db.quotationProposal.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
  }
}

-- CreateEnum
CREATE TYPE "TicketBillingOrigin" AS ENUM ('development', 'support');

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "billingOrigin" "TicketBillingOrigin" NOT NULL DEFAULT 'development',
ADD COLUMN     "conformityApprovedAt" TIMESTAMP(3),
ADD COLUMN     "conformityApprovedById" UUID,
ADD COLUMN     "originTicketId" UUID;

-- AlterTable
ALTER TABLE "TicketIteration" ADD COLUMN     "countsTowardDevelopment" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "TicketWorklog" ADD COLUMN     "billableAsSupport" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "countsTowardDevelopment" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "TicketConformity" (
    "id" UUID NOT NULL,
    "ticketId" UUID NOT NULL,
    "approvedById" UUID NOT NULL,
    "comment" TEXT,
    "approvedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketConformity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TicketConformity_ticketId_idx" ON "TicketConformity"("ticketId");

-- CreateIndex
CREATE INDEX "TicketConformity_approvedById_idx" ON "TicketConformity"("approvedById");

-- CreateIndex
CREATE INDEX "Ticket_originTicketId_idx" ON "Ticket"("originTicketId");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_conformityApprovedById_fkey" FOREIGN KEY ("conformityApprovedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_originTicketId_fkey" FOREIGN KEY ("originTicketId") REFERENCES "Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketConformity" ADD CONSTRAINT "TicketConformity_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketConformity" ADD CONSTRAINT "TicketConformity_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Quote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "subtotal" DECIMAL NOT NULL DEFAULT 0,
    "discount" DECIMAL NOT NULL DEFAULT 0,
    "total" DECIMAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    "validUntil" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "leadId" INTEGER NOT NULL,
    CONSTRAINT "Quote_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuoteItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL NOT NULL DEFAULT 0,
    "total" DECIMAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "quoteId" INTEGER NOT NULL,
    CONSTRAINT "QuoteItem_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Quote_number_key" ON "Quote"("number");

-- CreateIndex
CREATE INDEX "Quote_leadId_idx" ON "Quote"("leadId");

-- CreateIndex
CREATE INDEX "Quote_status_idx" ON "Quote"("status");

-- CreateIndex
CREATE INDEX "QuoteItem_quoteId_idx" ON "QuoteItem"("quoteId");

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    const plans = [
        { name: "trial", description: "Trial plan with limited features" },
        { name: "starter", description: "Starter plan with basic features" },
        { name: "premium", description: "Premium plan with all features" },
    ];
    const providers = [
        { name: "youtube", description: "Youtube integration" },
        { name: "instagram", description: "Instagram integration" },
        { name: "facebook", description: "Facebook integration" },
    ];
    for (const plan of plans) {
        yield prisma.plan.upsert({
            where: { name: plan.name },
            update: {},
            create: plan,
        });
    }
    for (const provider of providers) {
        yield prisma.provider.upsert({
            where: { name: provider.name },
            update: {},
            create: provider,
        });
    }
    console.log("Seed data inserted");
});
seed()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));

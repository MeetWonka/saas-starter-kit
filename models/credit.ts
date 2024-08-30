import { prisma } from '@/lib/prisma';

export const createCredit = async (params: {
    teamId: string;
    amount: number;
}) => {
    const { teamId, amount } = params;

    const credit = await prisma.credit.create({
        data: {
            teamId,
            amount,
        },
    });

    return credit;
};


export const updateCreditAmount = async (id: string, amountDelta: number) => {
    const credit = await prisma.credit.update({
        where: { id },
        data: {
            amount: {
                increment: amountDelta, // Increment or decrement the amount
            },
        },
    });

    return credit;
};


export const updateCredit = async (teamId: string, data: {
    amount?: number;
}) => {
    const { amount } = data;
    const updatedCredit = await prisma.credit.update({
        where: { teamId },
        data: {
            amount,
        },
    });

    return updatedCredit;
};


export const getCreditForTeam = async (teamId: string) => {
    return await prisma.credit.findUniqueOrThrow({
        where: { teamId },
    });
};

export const getCreditById = async (id: string) => {
    return await prisma.credit.findUniqueOrThrow({
        where: { id },
    });
};

import { prisma } from '@/lib/prisma';

export const createNumber = async (params: {
    teamId: string;
    phoneNumber: string;
    displayName: string;
    language: string;
    emails: string[];
  }) => {
    const { teamId, phoneNumber, displayName, language, emails } = params;
  
    const number = await prisma.number.create({
      data: {
        teamId,
        phoneNumber,
        displayName,
        language,
        emails: {
          create: emails.map((email) => ({ email })),
        },
      },
      include: {
        emails: true,
      },
    });
  
    return number;
  };

export const deleteNumber = async (id: string) => {
    return await prisma.number.delete({
        where: { id },
    });
};

export const getNumberById = async (id: string) => {
    return await prisma.number.findUniqueOrThrow({
      where: { id },
      include: {
        emails: true,
      },
    });
  };

export const getNumbersForTeam = async (teamId: string) => {
    return await prisma.number.findMany({
        where: { teamId },
        include: {
        emails: true,
        },
    });
};


export const updateNumber = async (id: string, data: {
    phoneNumber?: string;
    displayName?: string;
    language?: string;
    emails?: string[];
  }) => {
    const { phoneNumber, displayName, language, emails } = data;
  
    const updatedNumber = await prisma.number.update({
      where: { id },
      data: {
        phoneNumber,
        displayName,
        language,
        emails: emails
          ? {
              deleteMany: {}, // Delete existing emails
              create: emails.map((email) => ({ email })), // Add new emails
            }
          : undefined,
      },
      include: {
        emails: true,
      },
    });
  
    return updatedNumber;
  };
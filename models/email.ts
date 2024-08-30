import { prisma } from '@/lib/prisma';

export const createEmail = async (params: {
  numberId: string;
  email: string;
}) => {
  const { numberId, email } = params;

  const createdEmail = await prisma.email.create({
    data: {
      email,
      numberId,
    },
  });

  return createdEmail;
};

export const deleteEmail = async (id: string) => {
    return await prisma.email.delete({
      where: { id },
    });
  };

export const getEmailById = async (id: string) => {
return await prisma.email.findUniqueOrThrow({
    where: { id },
});
};

export const getEmailsForNumber = async (numberId: string) => {
    return await prisma.email.findMany({
      where: { numberId },
    });
  };


  export const updateEmail = async (id: string, newEmail: string) => {
    const updatedEmail = await prisma.email.update({
      where: { id },
      data: {
        email: newEmail,
      },
    });
  
    return updatedEmail;
  };


  export const deleteEmailsForNumber = async (numberId: string) => {
    return await prisma.email.deleteMany({
      where: { numberId },
    });
  };
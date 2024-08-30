import { getCurrentUserWithTeam, throwIfNoTeamAccess } from 'models/team';
import { throwIfNotAllowed } from 'models/user';
import { getNumberById, updateNumber, deleteNumber } from 'models/number';
import { deleteEmailsForNumber } from 'models/email';
import type { NextApiRequest, NextApiResponse } from 'next';
import { recordMetric } from '@/lib/metrics';
import { sendAudit } from '@/lib/retraced';
import { ApiError } from '@/lib/errors';
import { Prisma } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await throwIfNoTeamAccess(req, res);

    switch (req.method) {
      case 'GET':
        await handleGET(req, res);
        break;
      case 'PUT':
        await handlePUT(req, res);
        break;
      case 'DELETE':
        await handleDELETE(req, res);
        break;
      default:
        res.setHeader('Allow', 'GET, PUT, DELETE');
        res.status(405).json({ error: { message: `Method ${req.method} Not Allowed` } });
    }
  } catch (error: any) {
    const message = error.message || 'Something went wrong';
    const status = error.status || 500;
    res.status(status).json({ error: { message } });
  }
}

// Get a specific number by ID
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getCurrentUserWithTeam(req, res);

  throwIfNotAllowed(user, 'number', 'read');

  const numberId = req.query.number as string;

  const number = await getNumberById(numberId);

  if (!number || number.teamId !== user.team.id) {
    throw new ApiError(404, 'Number not found');
  }

  recordMetric('number.fetched');

  res.status(200).json({ data: number });
};

// Update a specific number by ID
const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getCurrentUserWithTeam(req, res);

  throwIfNotAllowed(user, 'number', 'update');

  const numberId = req.query.number as string;
  const { phoneNumber, displayName, language, emails } = req.body;

  let updatedNumber;

  try {
    updatedNumber = await updateNumber(numberId, {
      phoneNumber,
      displayName,
      language,
      emails,
    });

    if (!updatedNumber || updatedNumber.teamId !== user.team.id) {
      throw new ApiError(404, 'Number not found or you do not have access to update it.');
    }
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002' &&
      error.meta?.target
    ) {
      throw new ApiError(409, 'This number is already in use.');
    }

    throw error;
  }

  sendAudit({
    action: 'number.update',
    crud: 'u',
    user,
    team: user.team,
  });

  recordMetric('number.updated');

  res.status(200).json({ data: updatedNumber });
};

// Delete a specific number by ID
const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getCurrentUserWithTeam(req, res);

  throwIfNotAllowed(user, 'number', 'delete');

  const numberId = req.query.number as string;

  const number = await getNumberById(numberId);

  if (!number || number.teamId !== user.team.id) {
    throw new ApiError(404, 'Number not found or you do not have access to delete it.');
  }

  await deleteEmailsForNumber(numberId);

  await deleteNumber(numberId);

  sendAudit({
    action: 'number.delete',
    crud: 'd',
    user,
    team: user.team,
  });

  recordMetric('number.deleted');

  res.status(204).end();
};
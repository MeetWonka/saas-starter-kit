import { getCurrentUserWithTeam, throwIfNoTeamAccess } from 'models/team';
import { throwIfNotAllowed } from 'models/user';
import { createNumber, getNumbersForTeam } from 'models/number';
import type { NextApiRequest, NextApiResponse } from 'next';
import { recordMetric } from '@/lib/metrics';
import { sendAudit } from '@/lib/retraced';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await throwIfNoTeamAccess(req, res);

    switch (req.method) {
      case 'GET':
        await handleGET(req, res);
        break;
      case 'POST':
        await handlePOST(req, res);
        break;
      default:
        res.setHeader('Allow', 'GET, POST');
        res.status(405).json({ error: { message: `Method ${req.method} Not Allowed` } });
    }
  } catch (error: any) {
    const message = error.message || 'Something went wrong';
    const status = error.status || 500;
    res.status(status).json({ error: { message } });
  }
}

// List all numbers for a team
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getCurrentUserWithTeam(req, res);

  throwIfNotAllowed(user, 'number', 'read');

  const numbers = await getNumbersForTeam(user.team.id);

  recordMetric('numbers.listed');

  res.status(200).json({ data: numbers });
};

// Create a new number for a team
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getCurrentUserWithTeam(req, res);

  throwIfNotAllowed(user, 'number', 'create');

  const { phoneNumber, displayName, language, emails } = req.body;

  const createdNumber = await createNumber({
    teamId: user.team.id,
    phoneNumber,
    displayName,
    language,
    emails,
  });

  sendAudit({
    action: 'number.create',
    crud: 'c',
    user,
    team: user.team,
  });

  recordMetric('number.created');

  res.status(201).json({ data: createdNumber });
};
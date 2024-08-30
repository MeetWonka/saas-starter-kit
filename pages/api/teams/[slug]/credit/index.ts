import { getCurrentUserWithTeam, throwIfNoTeamAccess } from 'models/team';
import { throwIfNotAllowed, getFreeTrialConsumed, setFreeTrialConsumed } from 'models/user';
import { createCredit, getCreditForTeam } from 'models/credit';
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

// List all credits for a team
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('handleGET');
  const user = await getCurrentUserWithTeam(req, res);

  throwIfNotAllowed(user, 'credit', 'read');

  const credits = await getCreditForTeam(user.team.id);

  recordMetric('credits.listed');

  res.status(200).json({ data: credits });
};

// Create a new credit for a team
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getCurrentUserWithTeam(req, res);

  throwIfNotAllowed(user, 'credit', 'create');

  //TODO Get User Id
  const amount = await getFreeTrialConsumed(user.id) ? 0 : 15;

  const createdCredit = await createCredit({
    teamId: user.team.id,
    amount: amount,
  });

  sendAudit({
    action: 'credit.create',
    crud: 'c',
    user,
    team: user.team,
  });

  await setFreeTrialConsumed(user.id, true);

  recordMetric('credit.created');

  res.status(201).json({ data: createdCredit });
};

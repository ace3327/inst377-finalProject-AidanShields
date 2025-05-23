import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, department, dateStart, dateEnd, medium } = req.body;

  const { error } = await supabase.from('usersearches').insert([
    {
      query,
      filters: { department, dateStart, dateEnd, medium }
    }
  ]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ message: 'Search recorded' });
}
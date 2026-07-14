export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { licenseKey } = req.body || {};

  if (!licenseKey || !licenseKey.trim()) {
    return res.status(400).json({ error: 'Missing license key.' });
  }

  try {
    const params = new URLSearchParams();
    params.append('product_permalink', process.env.GUMROAD_PRODUCT_PERMALINK);
    params.append('license_key', licenseKey.trim());

    const r = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await r.json();

    if (data && data.success) {
      return res.status(200).json({ valid: true });
    }
    return res.status(200).json({ valid: false });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Could not verify license right now.' });
  }
}

// api/purge.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { runId, artifactId } = req.body;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const headers = { 'Authorization': `token ${GITHUB_TOKEN}` };

  try {
    // Delete artifact
    await fetch(`https://api.github.com/repos/alimuneeb425-bit/apk-compiler-node/actions/artifacts/${artifactId}`, {
      method: 'DELETE',
      headers
    });

    // Delete workflow run
    await fetch(`https://api.github.com/repos/alimuneeb425-bit/apk-compiler-node/actions/runs/${runId}`, {
      method: 'DELETE',
      headers
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

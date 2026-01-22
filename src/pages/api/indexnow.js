export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  const key = process.env.INDEXNOW_KEY;
  const keyLocation = `https://www.financecalculatorfree.com/${key}.txt`;

  const endpoint = `https://api.indexnow.org/indexnow?key=${key}&url=${encodeURIComponent(
    url
  )}&keyLocation=${encodeURIComponent(keyLocation)}`;

  try {
    const response = await fetch(endpoint);
    const text = await response.text();

    res.status(200).json({
      submittedUrl: url,
      indexnowResponse: text,
    });
  } catch (error) {
    res.status(500).json({
      error: "IndexNow request failed",
      details: error.message,
    });
  }
}

function extractVideoId(url) {
  const regex = /(?:v=|youtu\.be\/)([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function POST(request) {
  const { videoURL } = await request.json();
  const videoId = extractVideoId(videoURL);
  if (!videoId) {
    return new Response(JSON.stringify({ error: 'Invalid video URL' }), {   
            status: 400
        });
  }
  const response = await fetch('https://studify-backend-production.up.railway.app/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ video_id: videoId }),
  });
  const result = await response.json();
  return new Response(JSON.stringify(result), {
    status: 200
  })
  
}
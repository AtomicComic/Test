import { NextResponse } from 'next/server';

export async function GET() {
  const client_id = '29e011cdf67041baa13d003873608c04';
  const client_secret = 'c615959b63d04e8f959b01800bf7ef4b';
  console.log(client_id);
  try {
    // Fetch the access token from Spotify
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`,
    });
    const data = await response.json();
    if (response.ok) {
      // Return the access token in the response
      return NextResponse.json({ token: data.access_token });
    } else {
      // If the response from Spotify is not okay, return an error response
      return NextResponse.json({ error: data }, { status: response.status });
    }
  } catch (error) {
    // Handle network or other errors
    return NextResponse.json({ error: 'Error fetching Spotify token' }, { status: 500 });
  }
}
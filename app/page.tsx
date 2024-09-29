'use client'

import { useState, useEffect } from 'react';
import SpotifyWebPlayer from './components/SpotifyWebPlayer';
import AIThoughtProcess from './components/AIThoughtProcess';
import TrackInfo from './components/TrackInfo';
import UpcomingTracks from './components/UpcomingTracks';

export default function Home() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [aiThoughts, setAIThoughts] = useState('');
  const [crowdMood, setCrowdMood] = useState('Analyzing...');
  const [upcomingTracks, setUpcomingTracks] = useState([]);
  const [spotifyToken, setSpotifyToken] = useState('');
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // Track index in upcomingTracks

  useEffect(() => {
    fetchSpotifyToken();
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSpotifyToken = async () => {
    try {
      const response = await fetch('/api/spotify-token');
      const data = await response.json();
      setSpotifyToken(data.token);
    } catch (error) {
      console.error('Error fetching Spotify token:', error);
    }
  };

  const fetchData = async () => {
    try {
      const [trackResponse, thoughtsResponse, moodResponse, upcomingResponse] = await Promise.all([
        fetch('/api/current-track'),
        fetch('/api/ai-thoughts'),
        fetch('/api/crowd-mood'),
        fetch('/api/upcoming-tracks')
      ]);
      
      const trackData = await trackResponse.json();
      const thoughtsData = await thoughtsResponse.json();
      const moodData = await moodResponse.json();
      const upcomingData = await upcomingResponse.json();

      setCurrentTrack(trackData);
      setAIThoughts(thoughtsData.thoughts);
      setCrowdMood(moodData.mood);
      setUpcomingTracks(upcomingData.tracks);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleNextTrack = () => {
    if (currentTrackIndex < upcomingTracks.length - 1) {
      // Update the current track to the next one in the list
      setCurrentTrackIndex(currentTrackIndex + 1);
      setCurrentTrack(upcomingTracks[currentTrackIndex + 1]);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">CrowdMix AI DJ</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/10 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Crowd Mood</h2>
            <p>{crowdMood}</p>
          </div>
          
          <div className="bg-white/10 p-4 rounded-lg">
            <AIThoughtProcess thoughts={aiThoughts} />
          </div>
        </div>

        <div className="mb-8">
          {spotifyToken && <SpotifyWebPlayer token={spotifyToken} />}
          {currentTrack && <TrackInfo track={currentTrack} />}
        </div>

        {/* Button to display the next track */}
        {upcomingTracks.length > 0 && currentTrackIndex < upcomingTracks.length - 1 && (
          <button 
            onClick={handleNextTrack} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Next Song
          </button>
        )}

        <UpcomingTracks tracks={upcomingTracks} />
      </div>
    </main>
  );
}
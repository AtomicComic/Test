interface Track {
    name: string;
    artist: string;
  }
  
  export default function UpcomingTracks({ tracks }: { tracks: Track[] }) {
    return (
      <div className="bg-white/10 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">AI's Top Picks</h2>
        <ul>
          {tracks.map((track, index) => (
            <li key={index} className="mb-2 p-2 bg-white/5 rounded">
              <span className="font-medium">{track.name}</span> - <span>{track.artist}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
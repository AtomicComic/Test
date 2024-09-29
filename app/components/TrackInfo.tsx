interface Track {
    name: string;
    artist: string;
    albumCover: string;
  }
  
  export default function TrackInfo({ track }: { track: Track }) {
    return (
      <div className="flex items-center bg-white/10 p-4 rounded-lg">
        <img src={track.albumCover} alt={`${track.name} album cover`} className="w-16 h-16 mr-4 rounded" />
        <div>
          <h3 className="font-semibold">{track.name}</h3>
          <p>{track.artist}</p>
        </div>
      </div>
    );
  }
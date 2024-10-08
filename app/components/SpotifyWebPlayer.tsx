import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';

// Custom type definitions for Spotify SDK
interface SpotifyPlayer {
    addListener(event: string, callback: (state: any) => void): void;
    connect(): Promise<boolean>;
    getCurrentState(): Promise<any>;
    nextTrack(): Promise<void>;
    previousTrack(): Promise<void>;
    togglePlay(): Promise<void>;
}

interface SpotifySDK {
    Player: new (options: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume: number;
    }) => SpotifyPlayer;
}

declare global {
    interface Window {
        Spotify: SpotifySDK;
        onSpotifyWebPlaybackSDKReady: () => void;
    }
}

interface Track {
    name: string;
    album: {
        images: Array<{ url: string }>;
    };
    artists: Array<{ name: string }>;
}

const initialTrack: Track = {
    name: "",
    album: {
        images: [{ url: "" }]
    },
    artists: [{ name: "" }]
};

interface WebPlaybackProps {
    token: string;
}

function WebPlayback({ token }: WebPlaybackProps) {
    const [isPaused, setPaused] = useState<boolean>(false);
    const [isActive, setActive] = useState<boolean>(false);
    const [currentTrack, setTrack] = useState<Track>(initialTrack);
    const playerRef = useRef<SpotifyPlayer | null>(null);

    const initializePlayer = () => {
        const player = new window.Spotify.Player({
            name: 'Web Playback SDK',
            getOAuthToken: cb => { cb(token); },
            volume: 0.5
        });

        playerRef.current = player;

        player.addListener('ready', ({ device_id }: { device_id: string }) => {
            console.log('Ready with Device ID', device_id);
        });

        player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
            console.log('Device ID has gone offline', device_id);
        });

        player.addListener('player_state_changed', ((state: any) => {
            if (!state) {
                return;
            }

            setTrack(state.track_window.current_track);
            setPaused(state.paused);

            player.getCurrentState().then(state => {
                (!state) ? setActive(false) : setActive(true)
            });
        }));

        player.connect();
    }

    useEffect(() => {
        if (window.Spotify) {
            initializePlayer();
        }
    }, [token]);

    if (!isActive) {
        return (
            <div className="container">
                <div className="main-wrapper">
                    <b> Instance not active. Transfer your playback using your Spotify app </b>
                </div>
            </div>
        )
    } else {
        return (
            <div className="container">
                <div className="main-wrapper">
                    <img src={currentTrack.album.images[0].url} className="now-playing__cover" alt="" />

                    <div className="now-playing__side">
                        <div className="now-playing__name">{currentTrack.name}</div>
                        <div className="now-playing__artist">{currentTrack.artists[0].name}</div>

                        <button className="btn-spotify" onClick={() => { playerRef.current?.previousTrack() }} >
                            &lt;&lt;
                        </button>

                        <button className="btn-spotify" onClick={() => { playerRef.current?.togglePlay() }} >
                            {isPaused ? "PLAY" : "PAUSE"}
                        </button>

                        <button className="btn-spotify" onClick={() => { playerRef.current?.nextTrack() }} >
                            &gt;&gt;
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

interface SpotifyWebPlayerProps {
    token: string;
}

export default function SpotifyWebPlayer({ token }: SpotifyWebPlayerProps) {
    return (
        <>
            <Script
                src="https://sdk.scdn.co/spotify-player.js"
                strategy="afterInteractive"
                onLoad={() => {
                    window.onSpotifyWebPlaybackSDKReady = () => {
                        console.log('Spotify SDK Ready');
                    };
                }}
            />
            <WebPlayback token={token} />
        </>
    );
}

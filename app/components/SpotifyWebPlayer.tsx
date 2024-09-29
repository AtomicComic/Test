import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

function WebPlayback({ token }) {
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(track);
    const playerRef = useRef(null);

    const initializePlayer = () => {
        const player = new window.Spotify.Player({
            name: 'Web Playback SDK',
            getOAuthToken: cb => { cb(token); },
            volume: 0.5
        });

        playerRef.current = player;

        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
        });

        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        player.addListener('player_state_changed', (state => {
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
    }, []);

    if (!is_active) {
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
                    <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

                    <div className="now-playing__side">
                        <div className="now-playing__name">{current_track.name}</div>
                        <div className="now-playing__artist">{current_track.artists[0].name}</div>

                        <button className="btn-spotify" onClick={() => { playerRef.current.previousTrack() }} >
                            &lt;&lt;
                        </button>

                        <button className="btn-spotify" onClick={() => { playerRef.current.togglePlay() }} >
                            {is_paused ? "PLAY" : "PAUSE"}
                        </button>

                        <button className="btn-spotify" onClick={() => { playerRef.current.nextTrack() }} >
                            &gt;&gt;
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default function SpotifyWebPlayer({ token }) {
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
'use client';

import Image from 'next/image';

export default function DiscoverPage() {
    // Apple Music 推荐歌单数据
    const appleMusicPlaylists = [
        {
            id: 'am1',
            title: 'Happy Hits',
            coverUrl: 'http://8.217.105.136:5244/d/NicePlayMusic/recommend/playlist/applemusic/1.jpg',
            description: 'by Apple Music'
        },
        {
            id: 'am2',
            title: 'Mandopop',
            coverUrl: 'http://8.217.105.136:5244/d/NicePlayMusic/recommend/playlist/applemusic/2.jpg',
            description: 'by Apple Music'
        },
        {
            id: 'am3',
            title: 'Heartbreak Pop',
            coverUrl: 'http://8.217.105.136:5244/d/NicePlayMusic/recommend/playlist/applemusic/3.jpg',
            description: 'by Apple Music'
        },
        {
            id: 'am4',
            title: 'Festival Bangers',
            coverUrl: 'http://8.217.105.136:5244/d/NicePlayMusic/recommend/playlist/applemusic/4.jpg',
            description: 'by Apple Music'
        },
        {
            id: 'am5',
            title: 'Bedtime Beats',
            coverUrl: 'http://8.217.105.136:5244/d/NicePlayMusic/recommend/playlist/applemusic/5.jpg',
            description: 'by Apple Music'
        },
    ];

    return (
        <div className="w-full ml-8">

            {/* By Apple Music*/}
            <div className="w-full mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl text-common">By Apple Music</h2>
                </div>

                <div className="grid grid-cols-5 gap-5">
                    {appleMusicPlaylists.map((playlist) => (
                        <div key={playlist.id} className="rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">

                            <div className="relative aspect-square bg-gray-800 overflow-hidden rounded-lg" style={{ maxWidth: "70%", marginLeft: 0 }}>
                                <Image
                                    src={playlist.coverUrl}
                                    alt={playlist.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 20vw, (max-width: 1200px) 16vw, 14vw"
                                />
                            </div>
                            <div className="mt-3 text-left">
                                <h3 className="text-common text-base font-medium truncate">{playlist.title}</h3>
                                <p className="text-gray-400 text-sm truncate mt-1">{playlist.description}</p>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            {/* 其他发现页内容 */}
            <div className="ml-8 flex gap-20">

            </div>
        </div>
    );
}
export interface Song {
    songId: number;
    title: string;
    artist: string;
    songYear: number;
    genre?: string;
    durationMs: number;
    popularity: number;
    coverImage?: string;
}

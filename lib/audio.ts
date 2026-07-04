const AUDIO_BASE_URL =

process.env.NEXT_PUBLIC_AUDIO_BASE_URL

??

"/audio";
export function getAudioUrl(file:string){

    return `${AUDIO_BASE_URL}/${file}`;

}
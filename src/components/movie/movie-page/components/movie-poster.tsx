import Image from "next/image";

type Props = {
  posterUrl: string;
  poster: string;
  title: string;
};

export const MoviePoster = ({ posterUrl, poster, title }: Props) => (
  <div>
    <Image
      src={`${posterUrl}/posters/${poster}`}
      alt={`${title} poster`}
      className="max-h-75 max-w-50 sm:max-h-112 sm:max-w-76"
      height={450}
      width={300}
      priority
      loading="eager"
    />
  </div>
);

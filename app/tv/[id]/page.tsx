"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";


type TvDetail = {
  id: number;
  name?: string;
  poster_path: string | null;
  first_air_date?: string;
  overview?: string;
  vote_average?: number;
  genres?: { id: number; name: string }[];
};

export default function TvDetailPage() {
  const { id } = useParams();
  const [media, setMedia] = useState<TvDetail | null>(null);
  const API_KEY = "ba1cec48fc1dd704e1380ca13662dc44";
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromCategory = searchParams.get("from") || "tv";

  useEffect(() => {
    async function fetchDetail() {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=ja`
      );
      const data = await res.json();
      setMedia(data);
    }
    fetchDetail();
  }, [id]);

  if (!media) return <p>読み込み中...</p>;

  return (
    <div className={styles.detailContainer}>
      <div className={styles.poster}>
        {media.poster_path && (
          <Image
            src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
            alt={media.name || ""}
            width={300}
            height={450}
          />
        )}
      </div>
      <div className={styles.info}>
        <h1>{media.name}</h1>
        <div className={styles.meta}>
          <span className={styles.date}>
            {media.first_air_date || "不明"}
          </span>
          <span className={styles.status}>Released</span>
        </div>
        <div className={styles.genres}>
          {media.genres?.map((g) => (
            <span key={g.id} className={styles.genre}>
              {g.name}
            </span>
          ))}
        </div>
        <p>{media.overview || "説明はありません。"}</p>
        <p>評価: {media.vote_average?.toFixed(1) || "N/A"}</p>
      </div>

      <button
        onClick={() => router.push(`/?category=${fromCategory}`)}
        className={styles.backButton}
      >
        戻る
      </button>
    </div>
  );
}

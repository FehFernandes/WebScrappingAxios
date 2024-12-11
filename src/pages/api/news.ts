import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = "https://news.ycombinator.com";
  try {
    const response = await axios.get(url, { timeout: 10000 });
    const html = response.data;
    const $ = cheerio.load(html);
    const newsTitles: { title: string; link: string }[] = [];

    $("span.titleline").each((index, element) => {
      const title = $(element).text().trim();
      const link = $(element).find("a").attr("href") || "";
      newsTitles.push({ title, link });
    });

    // Filtrar notícias que contêm a palavra "Ubuntu"
    const filteredNews = newsTitles.filter((item) => item.title.includes(""));

    res.status(200).json({ news: filteredNews.slice(0, 20) });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Error fetching news" });
  }
}

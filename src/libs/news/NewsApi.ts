export interface News {
  source: {
    id: string
    name: string
  }
  author: string
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  content: string
}

export default class NewsAPI {
  static async getNews(url: string) {
    return fetch(url)
      .then(res => res.json())
      .then(data => data.articles as News[])
  }

  static async getHeadLines(): Promise<News[]> {
    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
    return this.getNews(url)
  }
}

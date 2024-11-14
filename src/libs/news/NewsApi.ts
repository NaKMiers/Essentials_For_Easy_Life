export interface News {
  id: string; 
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
  // Phương thức chung để lấy bài viết từ URL
  static async getNews(url: string): Promise<News[]> {
    return fetch(url)
      .then(res => res.json())
      .then(data => data.articles as News[])
  }

  // Cập nhật hàm getNewsByDate trong NewsAPI
static async getNewsByDate(from: string, to: string, q: string = 'news'): Promise<News[]> {
    const url = `https://newsapi.org/v2/everything?q=${q}&from=${from}&to=${to}&sortBy=popularity&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
    return this.getNews(url)
}

  // Lấy các tiêu đề bài viết
  static async getHeadLines(): Promise<News[]> {
    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
    return this.getNews(url)
  }

  //get new by id
  static async getNewsById(id: string) {
    const url = `https://newsapi.org/v2/everything?q=${id}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
    return this.getNews(url)  
  }

} 
export type UserRole = 'admin' | 'user'

export interface User {
  id: string
  email: string
  username: string
  fullName: string
  avatarUrl?: string
  bio?: string
  role: UserRole
  emailVerified: boolean
  createdAt: string
  status?: 'active' | 'suspended'
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export type ProjectStatus = 'draft' | 'published' | 'archived'

export type ProjectPricingType = 'free' | 'paid' | 'open_source'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  projectCount?: number
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface ProjectScreenshot {
  id: string
  url: string
  caption?: string
}

export interface ProjectChangelogEntry {
  version: string
  date: string
  notes: string
}

export interface Project {
  id: string
  slug: string
  title: string
  shortDescription: string
  description: string
  coverImageUrl: string
  screenshots: ProjectScreenshot[]
  videoUrl?: string
  category: Category
  tags: Tag[]
  techStack: string[]
  pricingType: ProjectPricingType
  priceCents: number
  currency: string
  status: ProjectStatus
  featured: boolean
  trending: boolean
  rating: number
  reviewCount: number
  likeCount: number
  viewCount: number
  downloadCount: number
  githubUrl?: string
  liveDemoUrl?: string
  documentationUrl?: string
  downloadUrl?: string
  installation?: string
  features?: string[]
  changelog?: ProjectChangelogEntry[]
  author: Pick<User, 'id' | 'username' | 'fullName' | 'avatarUrl'>
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  projectId: string
  user: Pick<User, 'id' | 'username' | 'fullName' | 'avatarUrl'>
  rating: number
  body: string
  createdAt: string
}

export interface OpenSourceResource {
  id: string
  name: string
  fullName: string
  description: string
  url: string
  category: string
  language: string
  stars: number
  forks: number
  topics: string[]
  thumbnailUrl?: string
}

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Order {
  id: string
  user: Pick<User, 'id' | 'username' | 'fullName' | 'avatarUrl' | 'email'>
  project: Pick<Project, 'id' | 'slug' | 'title' | 'coverImageUrl' | 'priceCents' | 'currency'>
  amountCents: number
  currency: string
  status: OrderStatus
  stripeSessionId?: string
  createdAt: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  coverImageUrl?: string
  author: Pick<User, 'id' | 'username' | 'fullName' | 'avatarUrl'>
  tags: string[]
  publishedAt: string
  readingMinutes: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface ProjectQuery {
  search?: string
  category?: string
  tech?: string
  pricing?: ProjectPricingType | 'all'
  sort?: 'latest' | 'popular' | 'top_rated' | 'most_downloaded'
  page?: number
  pageSize?: number
}

export interface StatsSummary {
  totalProjects: number
  totalUsers: number
  totalDownloads: number
  totalRevenueCents: number
}

export interface AdminAnalytics {
  summary: StatsSummary
  downloadsTrend: Array<{ date: string; value: number }>
  revenueTrend: Array<{ date: string; value: number }>
  userGrowth: Array<{ date: string; value: number }>
  topProjects: Array<Pick<Project, 'id' | 'title' | 'viewCount' | 'downloadCount' | 'rating'>>
}

export interface Testimonial {
  id: string
  name: string
  role: string
  avatarUrl?: string
  body: string
  rating: number
}

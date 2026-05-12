import type {
  AdminAnalytics,
  AuthResponse,
  BlogPost,
  Category,
  OpenSourceResource,
  Order,
  PaginatedResponse,
  Project,
  ProjectQuery,
  Review,
  StatsSummary,
  Tag,
  Testimonial,
  User,
} from '@/types/models'
import { http, USE_MOCK } from './http'
import { mockApi } from './mock-data'

import type { ProjectInput } from './mock-data'
export type { ProjectInput } from './mock-data'

const liveApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await http.post<AuthResponse>('/auth/login', { email, password })
    return data
  },
  async register(payload: { email: string; password: string; username: string; fullName: string }): Promise<AuthResponse> {
    const { data } = await http.post<AuthResponse>('/auth/register', payload)
    return data
  },
  async forgotPassword(email: string): Promise<{ ok: true; email: string }> {
    const { data } = await http.post<{ ok: true; email: string }>('/auth/forgot-password', { email })
    return data
  },
  async me(): Promise<User> {
    const { data } = await http.get<User>('/auth/me')
    return data
  },
  async categories(): Promise<Category[]> {
    const { data } = await http.get<Category[]>('/categories')
    return data
  },
  async tags(): Promise<Tag[]> {
    const { data } = await http.get<Tag[]>('/tags')
    return data
  },
  async projects(query: ProjectQuery = {}): Promise<PaginatedResponse<Project>> {
    const { data } = await http.get<PaginatedResponse<Project>>('/projects', { params: query })
    return data
  },
  async featuredProjects(): Promise<Project[]> {
    const { data } = await http.get<Project[]>('/projects/featured')
    return data
  },
  async trendingProjects(): Promise<Project[]> {
    const { data } = await http.get<Project[]>('/projects/trending')
    return data
  },
  async project(slug: string): Promise<Project | null> {
    const { data } = await http.get<Project>(`/projects/${slug}`)
    return data
  },
  async reviews(projectId: string): Promise<Review[]> {
    const { data } = await http.get<Review[]>(`/projects/${projectId}/reviews`)
    return data
  },
  async openSource(): Promise<OpenSourceResource[]> {
    const { data } = await http.get<OpenSourceResource[]>('/open-source')
    return data
  },
  async openSourceResource(slug: string): Promise<OpenSourceResource | null> {
    const { data } = await http.get<OpenSourceResource>(`/open-source/${slug}`)
    return data
  },
  async stats(): Promise<StatsSummary> {
    const { data } = await http.get<StatsSummary>('/stats')
    return data
  },
  async analytics(): Promise<AdminAnalytics> {
    const { data } = await http.get<AdminAnalytics>('/admin/analytics')
    return data
  },
  async orders(): Promise<Order[]> {
    const { data } = await http.get<Order[]>('/admin/orders')
    return data
  },
  async users(): Promise<User[]> {
    const { data } = await http.get<User[]>('/admin/users')
    return data
  },
  async blogPosts(): Promise<BlogPost[]> {
    const { data } = await http.get<BlogPost[]>('/blog')
    return data
  },
  async blogPost(slug: string): Promise<BlogPost | null> {
    const { data } = await http.get<BlogPost>(`/blog/${slug}`)
    return data
  },
  async testimonials(): Promise<Testimonial[]> {
    const { data } = await http.get<Testimonial[]>('/testimonials')
    return data
  },
  async checkoutSession(projectId: string): Promise<{ url: string; sessionId: string }> {
    const { data } = await http.post<{ url: string; sessionId: string }>(`/payments/checkout`, { projectId })
    return data
  },
  async myProjects(_authorId: string): Promise<Project[]> {
    const { data } = await http.get<Project[]>('/projects/mine')
    return data
  },
  async projectById(id: string): Promise<Project | null> {
    const { data } = await http.get<Project>(`/projects/by-id/${id}`)
    return data
  },
  async createProject(input: ProjectInput, _currentUser: User): Promise<Project> {
    const { data } = await http.post<Project>('/projects', input)
    return data
  },
  async updateProject(id: string, input: ProjectInput, _currentUser: User): Promise<Project> {
    const { data } = await http.put<Project>(`/projects/${id}`, input)
    return data
  },
  async deleteProject(id: string, _currentUser: User): Promise<void> {
    await http.delete(`/projects/${id}`)
  },
}

export const api = USE_MOCK ? mockApi : liveApi

export type Api = typeof liveApi

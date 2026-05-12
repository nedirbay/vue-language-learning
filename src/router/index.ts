import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import PublicLayout from '@/layouts/PublicLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

import HomeView from '@/views/public/HomeView.vue'
import ProjectsView from '@/views/public/ProjectsView.vue'
import ProjectDetailView from '@/views/public/ProjectDetailView.vue'
import OpenSourceView from '@/views/public/OpenSourceView.vue'
import OpenSourceDetailView from '@/views/public/OpenSourceDetailView.vue'
import BlogView from '@/views/public/BlogView.vue'
import BlogPostView from '@/views/public/BlogPostView.vue'
import AboutView from '@/views/public/AboutView.vue'
import CheckoutSuccessView from '@/views/public/CheckoutSuccessView.vue'
import NotFoundView from '@/views/public/NotFoundView.vue'

import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue'

import DashboardOverview from '@/views/dashboard/DashboardOverview.vue'
import PurchasesView from '@/views/dashboard/PurchasesView.vue'
import DownloadsView from '@/views/dashboard/DownloadsView.vue'
import FavoritesView from '@/views/dashboard/FavoritesView.vue'
import SettingsView from '@/views/dashboard/SettingsView.vue'

import AdminOverview from '@/views/admin/AdminOverview.vue'
import AdminProjects from '@/views/admin/AdminProjects.vue'
import AdminProjectEditor from '@/views/admin/AdminProjectEditor.vue'
import AdminOrders from '@/views/admin/AdminOrders.vue'
import AdminUsers from '@/views/admin/AdminUsers.vue'
import AdminBlog from '@/views/admin/AdminBlog.vue'
import AdminComments from '@/views/admin/AdminComments.vue'
import AdminSettings from '@/views/admin/AdminSettings.vue'

import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'home', component: HomeView, meta: { title: 'DevHub' } },
      { path: 'projects', name: 'projects', component: ProjectsView, meta: { title: 'Projects' } },
      {
        path: 'projects/:slug',
        name: 'project-detail',
        component: ProjectDetailView,
        meta: { title: 'Project' },
      },
      {
        path: 'open-source',
        name: 'open-source',
        component: OpenSourceView,
        meta: { title: 'Open source' },
      },
      {
        path: 'open-source/:slug',
        name: 'open-source-detail',
        component: OpenSourceDetailView,
        meta: { title: 'Open source resource' },
      },
      { path: 'blog', name: 'blog', component: BlogView, meta: { title: 'Blog' } },
      {
        path: 'blog/:slug',
        name: 'blog-post',
        component: BlogPostView,
        meta: { title: 'Blog post' },
      },
      { path: 'about', name: 'about', component: AboutView, meta: { title: 'About' } },
      {
        path: 'checkout/mock-success',
        name: 'checkout-success',
        component: CheckoutSuccessView,
        meta: { title: 'Thank you' },
      },
    ],
  },
  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'login', component: LoginView, meta: { guest: true } },
      { path: 'register', name: 'register', component: RegisterView, meta: { guest: true } },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: ForgotPasswordView,
        meta: { guest: true },
      },
    ],
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: DashboardOverview,
        meta: { title: 'Overview', subtitle: 'A quick look at your account.' },
      },
      {
        path: 'purchases',
        name: 'dashboard-purchases',
        component: PurchasesView,
        meta: { title: 'My purchases', subtitle: 'Projects you have access to.' },
      },
      {
        path: 'downloads',
        name: 'dashboard-downloads',
        component: DownloadsView,
        meta: { title: 'Downloads', subtitle: 'Your recent downloads.' },
      },
      {
        path: 'favorites',
        name: 'dashboard-favorites',
        component: FavoritesView,
        meta: { title: 'Favorites', subtitle: 'Things you bookmarked.' },
      },
      {
        path: 'settings',
        name: 'dashboard-settings',
        component: SettingsView,
        meta: { title: 'Account settings', subtitle: 'Profile, security, and preferences.' },
      },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'admin',
        component: AdminOverview,
        meta: { title: 'Overview', subtitle: 'Key metrics for your platform.' },
      },
      {
        path: 'projects',
        name: 'admin-projects',
        component: AdminProjects,
        meta: { title: 'Projects', subtitle: 'Manage your catalog.' },
      },
      {
        path: 'projects/new',
        name: 'admin-project-new',
        component: AdminProjectEditor,
        meta: { title: 'New project', subtitle: 'Create a new listing.' },
      },
      {
        path: 'projects/:id/edit',
        name: 'admin-project-edit',
        component: AdminProjectEditor,
        meta: { title: 'Edit project', subtitle: 'Update an existing listing.' },
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: AdminOrders,
        meta: { title: 'Orders', subtitle: 'Recent purchases and payments.' },
      },
      {
        path: 'users',
        name: 'admin-users',
        component: AdminUsers,
        meta: { title: 'Users', subtitle: 'Accounts, roles, and status.' },
      },
      {
        path: 'blog',
        name: 'admin-blog',
        component: AdminBlog,
        meta: { title: 'Blog', subtitle: 'Posts and announcements.' },
      },
      {
        path: 'comments',
        name: 'admin-comments',
        component: AdminComments,
        meta: { title: 'Comments', subtitle: 'Moderate user reviews.' },
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: AdminSettings,
        meta: { title: 'Platform settings', subtitle: 'Branding and policies.' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: PublicLayout,
    children: [
      { path: '', name: 'not-found', component: NotFoundView, meta: { title: 'Not found' } },
    ],
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, _from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'home' }
  }
  if (to.meta.guest && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }
  return true
})

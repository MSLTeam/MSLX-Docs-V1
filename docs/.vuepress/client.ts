import { defineClientConfig } from 'vuepress/client'
// import RepoCard from 'vuepress-theme-plume/features/RepoCard.vue'
// import NpmBadge from 'vuepress-theme-plume/features/NpmBadge.vue'
// import NpmBadgeGroup from 'vuepress-theme-plume/features/NpmBadgeGroup.vue'
// import Swiper from 'vuepress-theme-plume/features/Swiper.vue'
import './styles/index.css'
import Changelog from './components/Changelog.vue'
import AsideNav from './components/AsideNav.vue'
import DownloadMSLX from './components/DownloadMSLX.vue'
import { h } from 'vue'
import { Layout } from 'vuepress-theme-plume/client'
import RepoCard from 'vuepress-theme-plume/features/RepoCard.vue'
import CustomAuthors from './components/CustomAuthors.vue'
import FeatureGrid from './components/FeatureGrid.vue'
import ModernHero from './components/ModernHero.vue'
import GithubStars from './components/GithubStars.vue'
import Testimonials from './components/Testimonials.vue'
import ModernFAQ from './components/ModernFAQ.vue'
import CommunityGroups from './components/CommunityGroups.vue'


// import './theme/styles/custom.css'

export default defineClientConfig({
  enhance({ app }) {
    app.component('Changelog', Changelog)
    app.component('RepoCard', RepoCard)
    app.component('DownloadMSLX',DownloadMSLX)
    app.component('custom-authors', CustomAuthors)
    app.component('feature-grid', FeatureGrid)
    app.component('modern-hero', ModernHero)
    app.component('github-stars', GithubStars)
    app.component('testimonials', Testimonials)
    app.component('modern-faq', ModernFAQ)
    app.component('community-groups', CommunityGroups)
    // built-in components
    // app.component('RepoCard', RepoCard)
    // app.component('NpmBadge', NpmBadge)
    // app.component('NpmBadgeGroup', NpmBadgeGroup)
    // app.component('Swiper', Swiper) // you should install `swiper`

    // your custom components
    // app.component('CustomComponent', CustomComponent)
  },
  layouts: {
    Layout: h(Layout, null, {
      'aside-outline-after': () => h(AsideNav),
    }),
  },
})

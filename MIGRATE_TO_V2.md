# Migration from Old Style to Engineering First Site

Background: Previously I had used this site to be a way for me to learn javascript and react. I'm over that now that I have grown in my career and want this website to primarily be used to write blog articles and document projects I have worked on / am working on

I do also use the `/mm` route to host a march madness analytics site. 

Goal: Transform it into a modern personal blog
- however I still want to host my march madness site for people

The previous architecture relied on gatsby and react. I'm not tied to either of those, however I am open to keeping them

My primary goals:
- I want to write blog articles with highly engaging visuals
- I want users to easily be able to navigate the website, from blogs to projects
- Make the index page less "showy" and more about navigating to recent projects / blogs

---

## Migration Plan

### Phase 0: Technology Decision
**Decision: Stick with Gatsby or Migrate?**

| Option | Pros | Cons |
|--------|------|------|
| **Keep Gatsby** | No migration overhead, existing `/mm` routes work, familiar tooling | Gatsby ecosystem has slowed down, less modern DX |
| **Migrate to Next.js** | Better MDX support, modern features (App Router), great for blogs | Migration effort, need to port `/mm` pages |
| **Migrate to Astro** | Built for content sites, excellent performance, MDX support | Learning curve, need to port React components |

**Recommendation:** Stick with Gatsby for now, focus on content architecture. Consider migration to Next.js or Astro in a future phase.

---

### Phase 1: Content Architecture (Foundation)
**Goal:** Set up a scalable content system for blogs and projects

- [ ] **1.1** Install MDX support for rich blog content
  - Add `gatsby-plugin-mdx` and dependencies
  - Configure in `gatsby-config.js`
  
- [ ] **1.2** Create content directory structure
  ```
  content/
  ├── blogs/
  │   └── YYYY-MM-DD-title/
  │       ├── index.mdx
  │       └── images/
  └── projects/
      └── project-name/
          ├── index.mdx
          └── images/
  ```

- [ ] **1.3** Define frontmatter schema for blogs
  ```yaml
  ---
  title: "Blog Title"
  date: "2026-01-18"
  description: "Short description"
  tags: ["tag1", "tag2"]
  featured: true
  coverImage: "./cover.png"
  ---
  ```

- [ ] **1.4** Define frontmatter schema for projects
  ```yaml
  ---
  title: "Project Name"
  date: "2026-01-18"
  description: "What is this project?"
  status: "completed" | "in-progress" | "archived"
  technologies: ["React", "Python"]
  links:
    github: "https://github.com/..."
    live: "https://..."
  coverImage: "./cover.png"
  ---
  ```

---

### Phase 2: New Homepage Design
**Goal:** Create a clean, navigation-focused homepage

- [ ] **2.1** Design new homepage layout
  ```
  ┌─────────────────────────────────────┐
  │  Header: Name + Nav                 │
  ├─────────────────────────────────────┤
  │  Hero: Brief intro (2-3 sentences)  │
  ├─────────────────────────────────────┤
  │  Recent Blogs (3-4 cards)           │
  │  [View All Blogs →]                 │
  ├─────────────────────────────────────┤
  │  Featured Projects (2-3 cards)      │
  │  [View All Projects →]              │
  ├─────────────────────────────────────┤
  │  Footer: Social links + Contact     │
  └─────────────────────────────────────┘
  ```

- [ ] **2.2** Create reusable components
  - `<BlogCard />` - Preview card for blog posts
  - `<ProjectCard />` - Preview card for projects
  - `<Navigation />` - Site-wide nav component
  - `<Footer />` - Site-wide footer

- [ ] **2.3** Implement new index page (replace current `HomepageView`)

---

### Phase 3: Blog System
**Goal:** Build a complete blog experience with engaging visuals

- [ ] **3.1** Create blog listing page (`/blogs`)
  - Grid of blog cards with filtering by tag
  - Search functionality (optional)
  - Pagination or infinite scroll

- [ ] **3.2** Create blog post template
  - MDX rendering with custom components
  - Table of contents (auto-generated)
  - Reading time estimate
  - Related posts section

- [ ] **3.3** Create custom MDX components for rich content
  - `<Callout />` - Info/warning/tip boxes
  - `<CodeBlock />` - Syntax highlighted code with copy button
  - `<ImageGallery />` - Interactive image galleries
  - `<Chart />` - Data visualizations (you have recharts!)
  - `<Diagram />` - For technical diagrams
  - `<VideoEmbed />` - YouTube/Vimeo embeds

- [ ] **3.4** Migrate existing blog content (0.js through 5.js → MDX files)

---

### Phase 4: Projects System
**Goal:** Showcase projects with proper documentation

- [ ] **4.1** Create projects listing page (`/projects`)
  - Filter by technology/status
  - Visual grid layout

- [ ] **4.2** Create project detail template
  - Overview section
  - Technology badges
  - Links (GitHub, Live demo)
  - Full MDX content for documentation

- [ ] **4.3** Migrate existing project data to MDX format

---

### Phase 5: March Madness Integration
**Goal:** Keep `/mm` routes working seamlessly

- [ ] **5.1** Audit current `/mm` pages
  - `mm/index.js` - Main MM landing
  - `mm/bracket.js`, `mm/bracketv2.js` - Bracket viewers
  - `mm/datalab.js` - Analytics/data exploration
  - `mm/matchup.js` - Team matchup tool

- [ ] **5.2** Add navigation link to MM from main site
  - Add to footer: "March Madness Analytics →"
  - Consider seasonal visibility (Feb-April)

- [ ] **5.3** Ensure consistent styling
  - Apply new design system to MM pages (or keep separate)

---

### Phase 6: Polish & Launch
**Goal:** Final touches and deployment

- [ ] **6.1** Design system refinement
  - Color palette
  - Typography scale
  - Spacing system
  - Dark mode support (optional)

- [ ] **6.2** SEO optimization
  - Meta tags for all pages
  - Open Graph images
  - Sitemap generation
  - RSS feed for blogs

- [ ] **6.3** Performance audit
  - Image optimization
  - Lazy loading
  - Core Web Vitals check

- [ ] **6.4** Testing & Launch
  - Cross-browser testing
  - Mobile responsiveness
  - Deploy to production

---

## Suggested Order of Execution

| Priority | Phase | Estimated Effort | Notes |
|----------|-------|------------------|-------|
| 🔴 High | Phase 1: Content Architecture | 2-3 hours | Foundation - do this first |
| 🔴 High | Phase 2: New Homepage | 3-4 hours | Visible impact, motivating |
| 🟡 Medium | Phase 3: Blog System | 4-6 hours | Core feature |
| 🟡 Medium | Phase 4: Projects System | 2-3 hours | Similar to blogs |
| 🟢 Low | Phase 5: MM Integration | 1-2 hours | Already works, just needs links |
| 🟢 Low | Phase 6: Polish | 2-4 hours | Can iterate over time |

---

## Quick Wins to Start Today

1. **Install MDX support** - Unlocks rich blog content immediately
2. **Create first MDX blog post** - Test the system end-to-end
3. **Sketch new homepage** - Even a rough wireframe helps

---

## Files to Archive/Remove After Migration

- `src/pages/blogs/0.js` through `5.js` → Convert to MDX, then delete
- `src/components/Homepage/*` → Replace with new components
- Current `HomepageView.js` → Replace with new design
# MayaaLokam Roleplay Website

![MayaaLokam RP Logo](https://public.youware.com/users-website-assets/prod/5a2dce70-d0aa-4d77-bd97-1e6ed4517dee/Picsart-25-05-29-23-13-39-384.png)

A professional website for the MayaaLokam GTA 5 Roleplay server, optimized for GitHub Pages hosting.

## 📋 Features

- Responsive design that works on all devices
- Home page with server information and slideshow
- Whitelist application system (demo mode for GitHub Pages)
- Server rules and guidelines
- Duty tracking system (demo mode for GitHub Pages)
- Membership plans and pricing
- Server status integration with FiveM API

## 🚀 GitHub Pages Setup

This website is fully configured for GitHub Pages hosting:

1. All static assets are properly linked with relative paths
2. Backend features have demo modes for static hosting
3. SEO optimized with meta tags and sitemap.xml
4. `.nojekyll` file to bypass Jekyll processing
5. `CNAME` file for custom domain configuration
6. Form handling adapted for static hosting

## 📦 Repository Structure

```
/
├── assets/         # JavaScript utilities
├── css/            # Stylesheets
├── images/         # Images and graphics
├── js/             # JavaScript files
├── videos/         # Video files
├── 404.html        # Custom 404 page
├── CNAME           # Custom domain configuration
├── README.md       # This file
├── favicon.ico     # Website favicon
├── index.html      # Homepage
├── membership.html # Membership plans
├── robots.txt      # Search engine directives
├── rules.html      # Server rules
├── sitemap.xml     # Sitemap for search engines
└── whitelist.html  # Whitelist application
```

## 🔧 Local Development

To run this website locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mayaalokam-rp.git
   cd mayaalokam-rp
   ```

2. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python
   python -m http.server
   
   # Using Node.js with http-server
   npx http-server
   ```

3. Visit `http://localhost:8000` in your browser

## 📱 Responsive Testing

This website has been tested on:
- Desktop (1920x1080, 1366x768)
- Tablet (iPad, 768x1024)
- Mobile (iPhone 12, Galaxy S21)

## 🌐 SEO Optimization

- Custom meta descriptions for each page
- Semantic HTML structure
- Optimized images with alt tags
- sitemap.xml for search engine indexing
- robots.txt configuration

## 🔄 GitHub Pages Deployment

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Ready for GitHub Pages"
   git push origin main
   ```

2. Enable GitHub Pages in repository settings:
   - Go to Settings > Pages
   - Select branch: main
   - Click Save

3. Your site will be published at:
   `https://yourusername.github.io/mayaalokam-rp/`

4. For a custom domain:
   - Add your domain in GitHub Pages settings
   - Update the CNAME file with your domain
   - Configure DNS settings with your domain provider

## 📝 License

© 2025 MayaaLokam Roleplay. All Rights Reserved.

## 👨‍💻 Credits

Website developed and optimized by [Your Name]
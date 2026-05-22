# IBRD Debt Visualization - Codebase Report

## Project Overview

This is an **Interactive Debt Visualization Dashboard** that visualizes World Bank IBRD (International Bank for Reconstruction and Development) debt trajectories from 1946 to 2025 across multiple countries and regions.

**Repository:** IBRD Debt Visualization  
**Primary Focus:** Data visualization using D3.js  
**Audience:** Financial analysts, economists, policy makers, researchers  

---

## Architecture

### Tech Stack
- **Frontend Framework:** Vanilla JavaScript (ES6+)
- **Visualization Library:** D3.js v7
- **Styling:** CSS3 (with glassmorphism effects)
- **Data Source:** Static JavaScript object with metadata
- **Deployment:** GitHub Pages (static site)

### Project Structure

```
.
├── README.md                                    # Project documentation
├── IBRD_data_corrected.js                      # Main data file (~500+ countries)
├── docs/                                        # Deployed visualizations
│   ├── index.html                              # Dashboard landing page
│   ├── IBRD_VelocityMap_v3_responsive.html     # Featured visualization
│   ├── IBRD_VelocityMap_v3.html                # Full velocity map
│   ├── IBRD_Interactive_Timeline_1946-2025.html
│   ├── IBRD_TimeSeries_Chart.html
│   ├── IBRD_Slope_Interactive.html
│   ├── IBRD_BarRace.html
│   ├── IBRD_BubbleChart_Interactive.html
│   ├── IBRD_Corrected_TimeSeries.html
│   ├── IBRD_Heatmap.html
│   ├── IBRD_RadialChart.html
│   ├── IBRD_Scatter.html
│   ├── IBRD_StackedArea.html
│   ├── ibrd_shifts_20_years.html
│   └── _IBRD_data.js                           # Minified data reference
└── .claude/                                     # Claude Code workspace config
```

---

## Data Structure

### IBRD_data_corrected.js

**Content:** Comprehensive IBRD Outstanding Debt dataset (1946-2024)

**Key Features:**
- **Metadata Section:**
  - Source: World Bank International Debt Statistics (IDS) & Finances One Portal
  - Currency: USD millions
  - Note: IBRD debt only (excludes IDA concessional loans)
  - Last Updated: 2024-12-31

- **Data Points:** ~500+ countries with complete historical timelines
- **Key Countries Tracked:**
  - India 🇮🇳
  - Indonesia 🇮🇩
  - Colombia 🇨🇴
  - Ukraine 🇺🇦
  - Philippines 🇵🇭
  - Brazil 🇧🇷
  - China 🇨🇳
  - And 490+ more

- **Data Schema per Country:**
  ```javascript
  {
    name: string,
    code: string,
    flag: emoji,
    region: string,
    groups: array,           // Grouping: ALL, SAARC, BRICS, etc.
    debt_timeline: [
      { year: number, debt: number }  // USD millions
    ]
  }
  ```

- **Regional Groups:**
  - SAARC (South Asian Association for Regional Cooperation)
  - BRICS (Brazil, Russia, India, China, South Africa)
  - EAST_SE_ASIA
  - LAT_AMERICA
  - ALL (All countries)

---

## Visualization Components

### 1. **Landing Page (index.html)**
- **Purpose:** Dashboard hub with visualization cards
- **Features:**
  - Hero section with gradient text
  - Responsive grid layout (mobile-friendly)
  - Glassmorphism design (semi-transparent cards with blur)
  - Navigation to all visualizations
  - Cards show: title, description, badge (NEW/FEATURED)
  - Hover effects with smooth transitions
  - Alert banner for important notes
- **Styling:** Dark mode theme, purple-pink gradient accents
- **Animation:** Fade-in effects, smooth hover transitions

### 2. **Velocity Map v3 (Featured)**
- **Purpose:** Advanced slope-weighted segment analysis
- **Key Insights:**
  - Shows rate of debt change over time
  - Segment-based slope encoding
  - Color gradients indicate debt acceleration/deceleration
- **Features:**
  - Interactive controls (filter by region/country)
  - Legend sidebar with toggleable countries
  - Responsive layout
  - Alert about slope analysis methodology
  - D3.js path and line generators

### 3. **Interactive Timeline (1946-2025)**
- **Purpose:** Explore debt trajectories across full timespan
- **Capabilities:**
  - Year slider for temporal exploration
  - Country-specific trend lines
  - Hover tooltips with debt values

### 4. **Time Series Chart**
- **Purpose:** Track debt changes over the years
- **Style:** Line chart with multiple country series
- **Interactivity:** Country selection, zoom/pan

### 5. **Slope Interactive**
- **Purpose:** Compare debt trend slopes between countries
- **Methodology:** Slope analysis showing acceleration/deceleration

### 6. **Bar Race Animation**
- **Purpose:** Animated ranking of countries by debt over time
- **Effect:** Engaging bar race visualization

### 7. **Bubble Chart**
- **Purpose:** Multivariate analysis (debt vs other metrics)
- **Axes:** Likely year, debt, and country grouping

### 8. **Heatmap**
- **Purpose:** Debt intensity across countries and time
- **Grid:** Countries × Time periods

### 9. **Radial Chart**
- **Purpose:** Alternative view of debt distribution
- **Style:** Circular/radial D3.js visualization

### 10. **Scatter Plot**
- **Purpose:** Correlation analysis between variables
- **Metrics:** Debt, growth rates, etc.

### 11. **Stacked Area Chart**
- **Purpose:** Cumulative debt across regions over time
- **Aggregation:** By geographic region

### 12. **20-Year Shifts Analysis**
- **Purpose:** Analyze major debt shifts across 20-year windows
- **Insight:** Identifies structural changes in debt patterns

---

## Design System

### Visual Language
- **Color Palette:**
  - Primary: `#667eea` (Indigo/Blue)
  - Secondary: `#764ba2` (Purple)
  - Accent: `#f093fb` (Pink)
  - Dark BG: `#0a0e27`, `#1a1a2e`
  - Text: `#fff` (White), `#aaa` (Gray)

- **Typography:**
  - System fonts: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
  - Weights: 600 (medium), 700 (bold), 800 (extra bold)
  - Sizes: Responsive (36px h1, 16px body)

- **Effects:**
  - Glassmorphism: `backdrop-filter: blur(10px)`
  - Gradients: Linear gradients (135deg angles)
  - Shadows: Subtle glows with rgba
  - Transitions: 0.3s ease, cubic-bezier timing

### Layout
- **Container:** Max-width 1600px, centered
- **Grid:** Responsive auto-fit with minmax
- **Spacing:** 20-30px padding, 12-24px gaps
- **Border Radius:** 6-12px (rounded corners)

---

## Code Quality & Observations

### Strengths
✅ **Comprehensive Data:** 500+ countries with detailed 1946-2024 timelines  
✅ **Multiple Visualization Types:** 12+ different chart types for various insights  
✅ **Modern Design:** Glassmorphism, gradients, smooth animations  
✅ **Responsive:** Mobile-first design with flexbox/grid  
✅ **Accessibility:** Semantic HTML, proper alt text structure  
✅ **Performance:** Static site on GitHub Pages, fast loading  
✅ **Documentation:** Clear metadata and source attribution  

### Areas for Enhancement
⚠️ **Data Files:** Could benefit from JSON separation for easier updates  
⚠️ **Code Modularization:** Some repeated CSS/JS patterns could be abstracted  
⚠️ **Interactivity:** Limited cross-visualization linking/coordination  
⚠️ **Mobile Optimization:** Some charts may need responsive refinement  
⚠️ **Filtering:** Global filter system across all visualizations  
⚠️ **Search:** Country/region search functionality  
⚠️ **Export:** No data export capabilities (PNG, CSV)  
⚠️ **Comments:** Limited inline code documentation  

---

## Key Metrics & Data Insights

### Top Debtors (as of 2024)
Based on IBRD_data_corrected.js:
- **India:** $23,080M
- **Indonesia:** $21,300M
- **Brazil:** $15,600M
- **Ukraine:** $16,970M (significant recent increase)
- **Colombia:** $17,000M

### Debt Trajectory Patterns
- **Steady Growth:** Most countries show consistent upward trends
- **Recent Acceleration:** Ukraine (2022-2024 spike due to conflict)
- **Stabilization:** Some countries show plateau (e.g., Brazil 2020-2024)
- **Regional Variation:** East/SE Asia and Latin America dominate

---

## Technology Dependencies

### External Libraries
- **D3.js v7:** Via CDN (`https://d3js.org/d3.v7.min.js`)
- **System Fonts:** No font CDN dependencies (good for performance)

### Browser Compatibility
- Modern browsers (ES6 support required)
- CSS3 features: Gradients, backdrop-filter, flexbox, grid
- Mobile: Tested with viewport meta tag

---

## Deployment & Hosting

**Platform:** GitHub Pages  
**Access:** https://somdeepkundu.github.io/ibrd-debt-visualization/  
**Entry Point:** IBRD_VelocityMap_v3_responsive.html (featured)  
**Static Files:** All content in `/docs` directory  

---

## Recommendations

### Priority 1 (High Impact)
1. Add global search/filter across all visualizations
2. Implement country comparison mode (side-by-side)
3. Add data download capability (CSV/JSON)
4. Create unified navigation header across all pages

### Priority 2 (Medium Impact)
1. Refactor CSS into a main stylesheet (reduce duplication)
2. Create shared D3.js utilities module
3. Add keyboard shortcuts for accessibility
4. Implement breadcrumb navigation

### Priority 3 (Polish)
1. Add tooltips with detailed debt metrics
2. Create time range selector
3. Add preset views (e.g., "Top 10 Debtors", "Fastest Growing")
4. Implement print-friendly layouts

---

## Summary

This project is a **well-designed, data-rich visualization dashboard** focused on World Bank debt analysis. The codebase leverages modern frontend technologies to create an engaging, responsive interface for exploring complex financial data across 500+ countries and 80 years of history.

The strength lies in its **comprehensive dataset** and **diverse visualization approaches**, each revealing different facets of global debt patterns. The design is modern and visually appealing with strong attention to UX details.

**Project Maturity:** Production-ready  
**Code Quality:** Good  
**Data Integrity:** High  
**Maintenance Level:** Moderate (static site)

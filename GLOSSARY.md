# Academy Domain Glossary

Standard terminology and ubiquitous language used across the Academy Study Web Dashboard codebase, architectural decisions, and documentation.

---

### Core Concepts

#### 1. Study Dashboard
The primary landing workspace providing a consolidated view of active academic commitments, containing the New Courses carousel, enrolled course rosters, schedule timeline, and homework progress.

#### 2. Bento Grid
The modular, asymmetric visual layout organizing dashboard cards into clear, proportional information clusters (inspired by Swiss minimalism and Apple Bento patterns).

#### 3. Premium Plan
The subscription tier offering students access to verified masterclasses, advanced course materials, and 1-on-1 mentor guidance. Represented by a prominent floating-hero card in the left navigation sidebar.

#### 4. Floating Hero Illustration
A visual pattern where a high-resolution 3D or graphic illustration breaks through its container boundaries via negative margins and `overflow: visible`, creating perceived depth and visual hierarchy without displacing surrounding content.

#### 5. Compact Sidebar Rhythm
The vertical spacing hierarchy in the sidebar that optimizes brand margins, navigation item gaps, and padding to conserve vertical real estate while maintaining WCAG 2.1 AA 44×44px touch target compliance.

#### 6. Design Tokens
Semantic CSS Custom Properties governing global variables for colors, typography, elevations, spacing scales, and transitions across light and dark display modes.

#### 7. WAI-ARIA Tab Architecture
The accessible navigation pattern linking `tablist`, `tab`, and `tabpanel` elements with keyboard focus traversal (Arrow keys, Home, End) and screen-reader announcements via `aria-live`.

#### 8. Homework Dial
An interactive circular progress meter showing task completion percentage for individual course assignments.

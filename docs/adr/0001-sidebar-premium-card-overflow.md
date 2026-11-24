# ADR 0001: Sidebar Premium Plan Floating Overflow Illustration & Vertical Rhythm

## Status
Accepted

## Context
In the left sidebar of the Academy dashboard, the "Premium Plan" section informs students of masterclass benefits and provides an upgrade CTA. Originally, the image was constrained to 90px and clipped by `overflow: hidden` on `.premium-card`, diminishing its visual punch and flattening the sidebar hierarchy.

In contemporary Dribbble and SaaS design patterns (evaluated via `ui-ux-pro-max`), promotional callout cards frequently employ floating illustrations that break through the container boundary. To maximize this 3D pop-out effect without causing vertical collisions with the menu links above, the upper navigation block (`.sidebar__top`) needed to be compacted, freeing up vertical space so the illustration can extend substantially further above the card.

## Decision
1. **Compact Top Block (`.sidebar__top`)**:
   - Reduced sidebar brand margin from `3.2rem` to `1.8rem`.
   - Tightened menu item gap from `0.6rem` to `0.35rem`.
   - Optimized button vertical padding to `0.85rem 1.2rem` while preserving the minimum `44px` touch target required by WCAG 2.5.5 / 2.5.8.
   - Reduced overall sidebar padding from `2.4rem 1.6rem` to `1.8rem 1.4rem`.
2. **Container Overflow & Clearance**:
   - Set `overflow: visible` on `.premium-card` to enable graphic elements to pop outside the card's rectangular bounds.
   - Expanded `.premium-card` top margin to `7.2rem` to provide substantial breathing room between the last menu item and the card.
3. **Pronounced Negative Offset & Scaling**:
   - Wrapped the banner image in `.premium-card__img-wrap` with `margin-top: -6.8rem`, allowing over 55% of the illustration to float completely above the card boundary.
   - Scaled image width to `175px` (`max-width: 95%`).
   - Applied layered ambient drop shadow (`rgba(109, 40, 217, 0.32)`) casting depth onto the card and canvas.
4. **Micro-Interactions**:
   - On card hover, the floating illustration performs an elevated lift: `transform: translateY(-10px) scale(1.06)` accompanied by an intensified glow shadow (`rgba(109, 40, 217, 0.44)`).
   - Motion is disabled under `@media (prefers-reduced-motion: reduce)`.

## Consequences
- **Positive**: Dramatic visual hierarchy, prominent 3D badge aesthetic true to the original Dribbble concept, clean separation from navigation links, and full WCAG accessibility compliance.
- **Negative / Considerations**: On viewports with constrained height (< 600px), the sidebar's `overflow-y: auto` ensures that the user can still scroll smoothly without any layout clipping.

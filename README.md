# 3D Wedding Invitation with Spatial Rose Petals 🌸✨

An interactive, editorial-grade wedding invitation web application featuring a multi-layered 3D spatial depth effect, interactive mouse/touch parallax, and a physics-driven canvas shower of rose petals falling between the background mandap and the couple.

---

## 🌟 Key Features

- **3D Spatial Layering**:
  - **Plate 1 (Background)**: Grand wedding mandap with illuminated garlands and brass oil lamps.
  - **Plate 2 (Falling Petals)**: Rose and floral petals falling continuously from the top, visibly passing *between* the background mandap and the couple.
  - **Plate 3 (Foreground)**: Cleanly defringed, transparent couple cutout with contact stage shadowing.
  - **Plate 4 (Foreground Bokeh)**: Soft, out-of-focus petals drifting close to the camera for complete volumetric depth.
- **Interactive 3D Parallax**: Responds smoothly to cursor movement and touch dragging with spring-damped perspective tilting.
- **Realistic Petal Kinematics**: Canvas-rendered 3D tumbling, horizontal foreshortening, center-vein folds, and realistic lighting highlights across authentic Indian wedding florals (velvet rose, lotus, marigold, jasmine).
- **Wedding Details & RSVP**: Interactive event itinerary, venue details with Google Maps integration, and calendar `.ics` download.
- **Mobile First & High Performance**: Ultra-responsive layout designed for 60fps on modern mobile and desktop browsers.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) + HTML5 Canvas API

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd 3d-wedding-invitation-with-petals

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

The production single-file bundle will be compiled to the `dist/` directory.

---

## 📄 License

MIT

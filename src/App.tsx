import Hero from "./components/Hero";
import Invitation from "./components/Invitation";
import Rsvp from "./components/Rsvp";

export default function App() {
  return (
    <div className="relative min-h-screen bg-paper">
      <Hero />

      <main className="relative pb-16">
        <Invitation />
        <Rsvp />
      </main>
    </div>
  );
}

import Particles from "../Particles";

export function ParticlesBackground() {
  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <Particles
        // particleColors={["#f4ff8a", "#c6ff6b", "#ffe28a"]}
        particleColors={["#2a0489", "#36d4ff", "#7c3aed"]}
        particleCount={750}
        particleSpread={12}
        speed={0.1}
        particleBaseSize={170}
        glow={1.6}
        twinkle={0.9}
        moveParticlesOnHover={false}
        hoverEffect="parallax"
        sizeRandomness={0.8}
        drift="up"
        driftSpeed={0.4}
        disableRotation
        // lightMode
      />
    </div>
  );
}

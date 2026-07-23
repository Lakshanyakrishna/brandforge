import { Palette, Sparkles, Layers, Image as ImageIcon } from 'lucide-react';

const NODES = [
  { icon: Palette, label: 'Brand Kit', angle: -55, radius: 34, delay: '0s' },
  { icon: Sparkles, label: 'AI Generate', angle: 25, radius: 37, delay: '0.7s' },
  { icon: Layers, label: '4 Platforms', angle: 145, radius: 36, delay: '1.4s' },
  { icon: ImageIcon, label: 'Gallery', angle: -155, radius: 32, delay: '2.1s' },
];

export default function OrbitNodes() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div className="absolute top-1/2 left-1/2 w-[62%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-on-background/10" />

      {NODES.map(({ icon: Icon, label, angle, radius, delay }) => {
        const rad = (angle * Math.PI) / 180;
        const top = 50 + radius * Math.sin(rad);
        const left = 50 + radius * Math.cos(rad);

        return (
          <div
            key={label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ top: `${top}%`, left: `${left}%` }}
          >
            <div className="motion-safe:animate-[node-float_7s_ease-in-out_infinite]" style={{ animationDelay: delay }}>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low/90 backdrop-blur-md border border-surface-variant shadow-lg whitespace-nowrap">
                <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs font-medium text-on-surface">{label}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

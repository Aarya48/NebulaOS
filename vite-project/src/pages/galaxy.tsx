import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';
import { cn } from '@/lib/utils';

export default function GalaxyPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', margin: '0 auto', overflow: 'hidden' }}>
      <StarsBackground
        starColor="#FFF"
        className={cn(
          'absolute inset-0 flex items-center justify-center',
          'bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]'
        )}
      />
    </div>
  );
}

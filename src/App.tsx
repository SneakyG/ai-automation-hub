import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SprintBoard } from './components/board/SprintBoard';
import { DataManager } from './components/common/DataManager';
import { Dashboard } from './components/dashboard/Dashboard';
import { Sidebar } from './components/layout/Sidebar';
import { OutreachHub } from './components/outreach/OutreachHub';
import { PricingCalculator } from './components/pricing/PricingCalculator';
import { Roadmap } from './components/roadmap/Roadmap';
import { World3D } from './components/world3d/World3D';
import type { SectionId } from './types';

const SECTIONS: Record<SectionId, () => JSX.Element> = {
  dashboard: Dashboard,
  world: World3D,
  roadmap: Roadmap,
  board: SprintBoard,
  outreach: OutreachHub,
  pricing: PricingCalculator,
  data: DataManager,
};

const readHash = (): SectionId => {
  const h = window.location.hash.replace('#', '') as SectionId;
  return h in SECTIONS ? h : 'dashboard';
};

const App = () => {
  const [section, setSection] = useState<SectionId>(readHash);

  useEffect(() => {
    const onHash = () => setSection(readHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = (id: SectionId) => {
    window.location.hash = id;
    setSection(id);
    window.scrollTo({ top: 0 });
  };

  const Current = SECTIONS[section];

  return (
    <div className="flex min-h-screen">
      <Sidebar active={section} onChange={go} />
      <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-8 lg:pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <Current />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;

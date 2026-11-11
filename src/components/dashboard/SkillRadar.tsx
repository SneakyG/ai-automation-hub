import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import { SKILLS } from '../../data/mockData';
import { useAppStore } from '../../store/useAppStore';

export const SkillRadar = () => {
  const skills = useAppStore((s) => s.skills);
  const setSkill = useAppStore((s) => s.setSkill);
  const data = SKILLS.map((sk) => ({ skill: sk.label, value: skills[sk.key] }));

  return (
    <div className="card">
      <h2 className="font-semibold text-white">Radar kỹ năng</h2>
      <p className="mb-2 text-xs text-slate-400">Tự chấm 0–10 mỗi Chủ Nhật.</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="70%">
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
            <Radar dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {SKILLS.map((sk) => (
          <label key={sk.key} className="text-xs text-slate-300">
            <span className="flex justify-between">
              {sk.label}
              <span className="font-semibold text-cyan-300">{skills[sk.key]}</span>
            </span>
            <input
              type="range"
              min={0}
              max={10}
              value={skills[sk.key]}
              onChange={(e) => setSkill(sk.key, Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </label>
        ))}
      </div>
    </div>
  );
};

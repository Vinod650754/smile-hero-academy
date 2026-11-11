import React, { useState, useEffect, useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';
import { supabase } from '../supabaseClient';
import confetti from 'canvas-confetti';
import { Gift, Ticket, Check } from 'lucide-react';

const REWARDS = [
  { id: 1, title: 'Superhero Toothbrush Voucher', cost: 50, emoji: '🪥', desc: 'Show code at clinic reception for a colorful toothbrush!' },
  { id: 2, title: 'Smile Champion Certificate', cost: 100, emoji: '📜', desc: 'Official printed certificate signed by your dentist.' },
];

export default function ClinicRewards() {
  const { profile, setProfile } = useContext(ProfileContext);
  const [userVouchers, setUserVouchers] = useState([]);

  useEffect(() => {
    if (profile.device_id) {
      loadVouchers();
    }
  }, [profile.device_id]);

  const loadVouchers = async () => {
    const { data } = await supabase
      .from('vouchers')
      .select('*')
      .eq('device_id', profile.device_id)
      .order('created_at', { ascending: false });
    if (data) setUserVouchers(data);
  };

  const handleRedeem = async (reward) => {
    if (profile.stars < reward.cost) return;

    const newStars = profile.stars - reward.cost;
    const code = 'HERO-' + Math.floor(1000 + Math.random() * 9000);

    try {
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .update({ stars: newStars })
        .eq('device_id', profile.device_id)
        .select()
        .single();

      if (updatedProfile) setProfile(updatedProfile);

      const { data: newVoucher } = await supabase
        .from('vouchers')
        .insert([{ device_id: profile.device_id, code, reward_title: reward.title, cost_stars: reward.cost }])
        .select()
        .single();

      if (newVoucher) setUserVouchers(prev => [newVoucher, ...prev]);
      confetti({ particleCount: 100, spread: 70 });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-4 text-center">
      <div className="flex items-center justify-center gap-2 mb-1">
        <Gift className="text-coralHero" size={28} />
        <h2 className="text-2xl font-black text-navyHero">Clinic Reward Store</h2>
      </div>
      <p className="text-gray-500 text-sm mb-6">Trade your earned stars for real physical rewards at your next dental visit!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {REWARDS.map(r => {
          const canAfford = profile.stars >= r.cost;
          return (
            <div key={r.id} className="bg-white rounded-3xl p-5 border border-sky-100 shadow-sm flex flex-col justify-between text-left">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-4xl">{r.emoji}</span>
                  <span className="bg-yellowHero/30 text-navyHero font-black text-xs px-2.5 py-1 rounded-full">
                    ⭐ {r.cost} Stars
                  </span>
                </div>
                <h4 className="font-extrabold text-navyHero text-base mb-1">{r.title}</h4>
                <p className="text-xs text-gray-500 mb-4">{r.desc}</p>
              </div>
              <button
                disabled={!canAfford}
                onClick={() => handleRedeem(r)}
                className={`py-3 rounded-2xl font-extrabold text-xs transition-all ${
                  canAfford
                    ? 'bg-tealHero text-white hover:opacity-90 shadow-sm'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {canAfford ? 'Redeem Voucher' : `Need ${r.cost - profile.stars} more stars`}
              </button>
            </div>
          );
        })}
      </div>

      {userVouchers.length > 0 && (
        <div className="text-left bg-white rounded-3xl p-6 border border-sky-100 shadow-sm">
          <h3 className="font-extrabold text-navyHero text-lg mb-4 flex items-center gap-2">
            <Ticket className="text-tealHero" size={20} /> My Active Reception Vouchers
          </h3>
          <div className="space-y-3">
            {userVouchers.map(v => (
              <div key={v.id} className="bg-skyBg p-4 rounded-2xl border border-sky-200 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">{v.reward_title}</span>
                  <div className="text-xl font-black text-tealHero tracking-wider">{v.code}</div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Check size={14} /> Ready for Reception
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, X } from 'lucide-react';
import { ProfileService } from '@/services/profile.service';

export default function InterestPage() {
  const router = useRouter();
  
  // Tag input states
  const [inputValue, setInputValue] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [hasProfile, setHasProfile] = useState(false);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Add tag on Enter or Space
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault();
      const val = inputValue.trim();
      
      // Prevent duplicates and empty tags
      if (val && !interests.includes(val)) {
        setInterests([...interests, val]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && interests.length > 0) {
      // Allow removing last tag with backspace if input is empty
      e.preventDefault();
      const newInterests = [...interests];
      newInterests.pop();
      setInterests(newInterests);
    }
  };
  
  const removeInterest = (indexToRemove: number) => {
    setInterests(interests.filter((_, index) => index !== indexToRemove));
  };
  
  useEffect(() => {
    // Load existing interests from API
    ProfileService.getProfile()
      .then((profile) => {
        setHasProfile(true);
        const p = profile as Record<string, any>;
        if (p?.interests && Array.isArray(p.interests)) {
          // Small timeout to avoid React state update during render warning
          const timer = setTimeout(() => {
            setInterests(p.interests || []);
          }, 0);
          return () => clearTimeout(timer);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          router.push('/login');
        } else if (err?.response?.status === 404) {
          setHasProfile(false);
        } else {
          console.error('Failed to load profile for interests', err);
        }
      });
  }, [router]);

  const handleSave = async () => {
    try {
      if (hasProfile) {
        await ProfileService.updateProfile({ interests });
      } else {
        await ProfileService.createProfile({ interests });
        setHasProfile(true);
      }
      router.push('/profile');
    } catch (err) {
      console.error('Failed to save interests', err);
    }
  };

  return (
    <main className="min-h-screen flex flex-col p-4 sm:p-8 text-white relative">
      {/* Top Navigation */}
      <div className="w-full flex justify-between items-center z-10 pt-4 pb-12">
        <button 
          onClick={() => router.push('/profile')} 
          className="flex items-center gap-1 text-white hover:text-white/80 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
          <span className="font-bold text-base">Back</span>
        </button>
        
        <button 
          onClick={handleSave}
          className="font-bold text-[14px] hover:opacity-80 transition-opacity"
          style={{ 
            background: 'linear-gradient(90deg, #ABFFFD 0%, #4599DB 50%, #AADAFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent'
          }}
        >
          Save
        </button>
      </div>
      
      {/* Centered Content Container */}
      <div className="flex-grow flex flex-col w-full max-w-md mx-auto pt-10">
        
        {/* Gradients Headers */}
        <h1 
          className="text-2xl font-bold mb-4"
          style={{ 
            background: 'linear-gradient(90deg, #94783E 0%, #F3EDA6 16.67%, #F8FAE5 33.33%, #FFE2BE 50%, #D5BE88 66.67%, #F8FAE5 83.33%, #D5BE88 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent'
          }}
        >
          Tell everyone about yourself
        </h1>
        
        <h2 className="text-white text-[20px] font-bold mb-8">
          What interest you?
        </h2>
        
        {/* Custom Tag Input Form */}
        <div className="w-full min-h-[52px] bg-white/[0.06] rounded-[8px] p-2 flex flex-wrap items-center gap-2 focus-within:ring-1 focus-within:ring-white/20 transition-all">
          
          {/* Render active tags */}
          {interests.map((interest, index) => (
            <div 
              key={`${interest}-${index}`} 
              className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-[4px]"
            >
              <span className="text-[13px] text-white">{interest}</span>
              <button 
                onClick={() => removeInterest(index)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="h-3 w-3" strokeWidth={3} />
              </button>
            </div>
          ))}
          
          {/* Input field */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow min-w-[120px] h-8 bg-transparent border-none text-white text-[14px] outline-none px-2"
          />
        </div>
      </div>
    </main>
  );
}

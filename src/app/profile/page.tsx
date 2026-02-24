'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getHoroscope, getZodiac, calculateAge, formatBirthday } from '@/utils/astrology';
import { jwtDecode } from 'jwt-decode';

import { ProfileService } from '@/services/profile.service';

export default function ProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  
  // Edit states
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  
  // Profile Data States
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [horoscope, setHoroscope] = useState('');
  const [zodiac, setZodiac] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [isAboutEmpty, setIsAboutEmpty] = useState(true);
  const [hasProfile, setHasProfile] = useState(false); // Track if profile exists on backend

  // Load from API
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      if (decoded?.email) {
        // Fallback to email if no username exists on profile
        setUsername(decoded.email.split('@')[0]);
      }
    } catch (e) {
      console.error('Invalid token');
    }

    ProfileService.getProfile()
      .then((profile) => {
        setHasProfile(true);
        const p = profile as Record<string, any>;
        if (p?.username) setUsername(p.username);
        if (p?.displayName) setDisplayName(p.displayName);
        if (p?.gender) setGender(p.gender);
        if (p?.birthday) {
          // Convert from ISO string (or any format backend sends) to YYYY-MM-DD for the <input type="date">
          try {
            const dateObj = new Date(p.birthday);
            if (!isNaN(dateObj.getTime())) {
              setBirthday(dateObj.toISOString().split('T')[0]);
            } else {
              setBirthday(p.birthday);
            }
          } catch (e) {
            setBirthday(p.birthday);
          }
        }
        if (p?.height) setHeight(p.height?.toString() || '');
        if (p?.weight) setWeight(p.weight?.toString() || '');
        if (p?.profileImage) setProfileImage(p.profileImage);
        if (p?.interests) setInterests(p.interests);

        if (p?.displayName || p?.gender || p?.birthday || p?.height || p?.weight) {
          setIsAboutEmpty(false);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          router.push('/login');
        } else if (err?.response?.status === 404) {
          // Profile doesn't exist yet, we can let them create it.
          setHasProfile(false);
        } else {
          console.error('Failed to load profile', err);
        }
      });
  }, [router]);

  const handleSaveAbout = async () => {
    try {
      const payload = {
        displayName,
        gender,
        birthday,
        height: height ? Number(height) : undefined,
        weight: weight ? Number(weight) : undefined,
        profileImage: profileImage || undefined,
      };

      if (hasProfile) {
        await ProfileService.updateProfile(payload);
      } else {
        await ProfileService.createProfile(payload);
        setHasProfile(true);
      }

      setIsEditingAbout(false);
      if (displayName || gender || birthday || height || weight) {
        setIsAboutEmpty(false);
      } else {
        setIsAboutEmpty(true);
      }
    } catch (err) {
      console.error('Failed to save profile', err);
      // Optional: Add error toast or state here
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (birthday) {
      // Small timeout to prevent synchronous state update loop warning during render
      const timer = setTimeout(() => {
        setHoroscope(getHoroscope(birthday));
        setZodiac(getZodiac(birthday));
      }, 0);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setHoroscope('');
        setZodiac('');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [birthday]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <main className="min-h-screen flex flex-col p-4 sm:p-8 text-white relative overflow-x-hidden overflow-y-auto">
      {/* Top Navigation - Positioned absolute so it doesn't affect centering */}
      <div className="absolute top-8 left-4 sm:left-8 w-full pr-8 sm:pr-16 flex justify-between items-center z-10">
        <Link href="/" className="flex items-center gap-1 text-white hover:text-white/80 transition-colors">
          <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
          <span className="font-bold text-base">Back</span>
        </Link>
        <span className="font-semibold text-lg pr-4 sm:pr-8 mx-auto">@{displayName || username || '...'}</span>
        <button 
          onClick={handleLogout}
          className="text-[13px] font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
        >
          Logout
        </button>
      </div>
      
      {/* Centered Content Container */}
      <div className="flex-grow flex flex-col justify-center w-full max-w-md mx-auto pt-20 pb-8 gap-6">
        
        {/* Header Profile Image Box */}
        <div className="relative w-full h-[190px] rounded-[16px] bg-[#162329] overflow-hidden">
          {profileImage && (
            <img src={profileImage} alt="Profile Cover" className="absolute inset-0 w-full h-full object-cover opacity-80" />
          )}
          
          {/* Bottom Info Layer */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-2">
            <span className="font-bold text-[16px]">
              @{displayName || username}{birthday ? `, ${calculateAge(birthday)}` : ','}
            </span>
            {gender && <span className="text-[13px] text-white/80">{gender}</span>}
            
            {(horoscope || zodiac) && (
              <div className="flex gap-2 mt-1">
                {horoscope && (
                  <div className="px-3 py-1 bg-white/[0.06] rounded-full flex items-center gap-1 border border-white/10 backdrop-blur-sm">
                    {/* Simplified Horoscope Icon placeholder */}
                    <span className="text-[12px]">{horoscope}</span>
                  </div>
                )}
                {zodiac && (
                  <div className="px-3 py-1 bg-white/[0.06] rounded-full flex items-center gap-1 border border-white/10 backdrop-blur-sm">
                    {/* Simplified Zodiac Icon placeholder */}
                    <span className="text-[12px]">{zodiac}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* About Card */}
        <div className="w-full bg-[#0E191F] rounded-[14px] p-4 flex flex-col gap-6 transition-all duration-300">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-[14px]">About</h2>
            
            {isEditingAbout ? (
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsEditingAbout(false)}
                  className="font-bold text-[13px] text-white/50 hover:text-white/80 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveAbout}
                  className="font-bold text-[13px] hover:opacity-80 transition-opacity"
                  style={{ 
                    background: 'linear-gradient(90deg, #94783E 0%, #F3EDA6 16.67%, #F8FAE5 33.33%, #FFE2BE 50%, #D5BE88 66.67%, #F8FAE5 83.33%, #D5BE88 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  Save & Update
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditingAbout(true)}
                className="text-white hover:text-white/80 transition-colors"
              >
                <Pencil className="w-4 h-4" strokeWidth={2.5} />
              </button>
            )}
          </div>
          
          {isEditingAbout ? (
            <div className="flex flex-col gap-5 pt-2">
              {/* Add Image Section */}
              <div className="flex items-center gap-4 mb-2">
                <label className="w-[57px] h-[57px] bg-white/[0.08] rounded-[17px] flex items-center justify-center hover:bg-white/[0.12] transition-colors overflow-hidden relative cursor-pointer">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="gold-gradient" x1="0%" y1="50%" x2="100%" y2="50%">
                            <stop offset="0%" stopColor="#94783E" />
                            <stop offset="16.67%" stopColor="#F3EDA6" />
                            <stop offset="33.33%" stopColor="#F8FAE5" />
                            <stop offset="50%" stopColor="#FFE2BE" />
                            <stop offset="66.67%" stopColor="#D5BE88" />
                            <stop offset="83.33%" stopColor="#F8FAE5" />
                            <stop offset="100%" stopColor="#D5BE88" />
                          </linearGradient>
                        </defs>
                        <path d="M12 5V19M5 12H19" stroke="url(#gold-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload} 
                  />
                </label>
                <span className="text-[13px] text-white">Add image</span>
              </div>
              
              {/* Form Fields inline */}
              <div className="flex flex-col gap-3">
                {/* Display Name */}
                <div className="flex items-center justify-between">
                  <span className="text-white/30 text-[13px] w-1/3">Display name:</span>
                  <Input 
                    placeholder="Enter name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-2/3 h-9 bg-white/[0.04] border border-white/20 text-white placeholder:text-white/30 text-right rounded-[8px] focus-visible:ring-1 focus-visible:ring-white/30" 
                  />
                </div>
                
                {/* Gender */}
                <div className="flex items-center justify-between">
                  <span className="text-white/30 text-[13px] w-1/3">Gender:</span>
                  <select 
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-2/3 h-9 bg-white/[0.04] border border-white/20 text-white/30 text-right rounded-[8px] px-3 outline-none focus:ring-1 focus:ring-white/30 appearance-none text-[14px]"
                    style={{
                      backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'rgba(255,255,255,0.3)\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1em'
                    }}
                  >
                    <option value="" disabled hidden>Select Gender</option>
                    <option value="Male" className="bg-[#0E191F] text-white">Male</option>
                    <option value="Female" className="bg-[#0E191F] text-white">Female</option>
                  </select>
                </div>
                
                {/* Birthday */}
                <div className="flex items-center justify-between">
                  <span className="text-white/30 text-[13px] w-1/3">Birthday:</span>
                  <Input 
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-2/3 h-9 bg-white/[0.04] border border-white/20 text-white/30 rounded-[8px] focus-visible:ring-1 focus-visible:ring-white/30 text-right pr-3" 
                  />
                </div>
                
                {/* Horoscope */}
                <div className="flex items-center justify-between">
                  <span className="text-white/30 text-[13px] w-1/3">Horoscope:</span>
                  <Input 
                    placeholder="--"
                    value={horoscope}
                    readOnly
                    className="w-2/3 h-9 bg-white/[0.04] border border-white/20 text-white/30 placeholder:text-white/30 text-right rounded-[8px] focus-visible:ring-0 cursor-not-allowed" 
                  />
                </div>
                
                {/* Zodiac */}
                <div className="flex items-center justify-between">
                  <span className="text-white/30 text-[13px] w-1/3">Zodiac:</span>
                  <Input 
                    placeholder="--"
                    value={zodiac}
                    readOnly
                    className="w-2/3 h-9 bg-white/[0.04] border border-white/20 text-white/30 placeholder:text-white/30 text-right rounded-[8px] focus-visible:ring-0 cursor-not-allowed" 
                  />
                </div>
                
                {/* Height */}
                <div className="flex items-center justify-between">
                  <span className="text-white/30 text-[13px] w-1/3">Height:</span>
                  <div className="w-2/3 relative">
                    <Input 
                      type="text"
                      inputMode="numeric"
                      placeholder="Add height"
                      value={height}
                      onChange={(e) => setHeight(e.target.value.replace(/[^0-9.]/g, ''))}
                      className="w-full h-9 bg-white/[0.04] border border-white/20 text-white placeholder:text-white/30 text-right rounded-[8px] focus-visible:ring-1 focus-visible:ring-white/30" 
                    />
                    {height && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-[13px]">cm</span>}
                  </div>
                </div>
                
                {/* Weight */}
                <div className="flex items-center justify-between">
                  <span className="text-white/30 text-[13px] w-1/3">Weight:</span>
                  <div className="w-2/3 relative">
                    <Input 
                      type="text"
                      inputMode="numeric"
                      placeholder="Add weight"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value.replace(/[^0-9.]/g, ''))}
                      className="w-full h-9 bg-white/[0.04] border border-white/20 text-white placeholder:text-white/30 text-right rounded-[8px] focus-visible:ring-1 focus-visible:ring-white/30" 
                    />
                    {weight && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-[13px]">kg</span>}
                  </div>
                </div>
              </div>
            </div>
          ) : isAboutEmpty ? (
            <p className="text-white/50 text-[14px] leading-relaxed">
              Add in your your to help others know you better
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {birthday && (
                <div className="flex items-center gap-1 text-[13px]">
                  <span className="text-white/30">Birthday:</span>
                  <span className="text-white">{formatBirthday(birthday)} (Age {calculateAge(birthday)})</span>
                </div>
              )}
              {horoscope && (
                <div className="flex items-center gap-1 text-[13px]">
                  <span className="text-white/30">Horoscope:</span>
                  <span className="text-white">{horoscope}</span>
                </div>
              )}
              {zodiac && (
                <div className="flex items-center gap-1 text-[13px]">
                  <span className="text-white/30">Zodiac:</span>
                  <span className="text-white">{zodiac}</span>
                </div>
              )}
              {height && (
                <div className="flex items-center gap-1 text-[13px]">
                  <span className="text-white/30">Height:</span>
                  <span className="text-white">{height} cm</span>
                </div>
              )}
              {weight && (
                <div className="flex items-center gap-1 text-[13px]">
                  <span className="text-white/30">Weight:</span>
                  <span className="text-white">{weight} kg</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Interests Card */}
        <div className="w-full bg-[#0E191F] rounded-[14px] p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-[14px]">Interest</h2>
            <Link href="/interest" className="text-white hover:text-white/80 transition-colors">
              <Pencil className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          </div>
          {interests.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {interests.map((interest, i) => (
                <div key={i} className="px-3 py-1.5 bg-white/10 rounded-full text-[13px] font-medium text-white">
                  {interest}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/50 text-[14px] leading-relaxed">
              Add in your interest to find a better match
            </p>
          )}
        </div>
        
      </div>
    </main>
  );
}

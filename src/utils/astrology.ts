export const calculateAge = (dateString: string): number => {
  if (!dateString) return 0;
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const formatBirthday = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day} / ${month} / ${year}`;
};

export const getHoroscope = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return 'Gemini';
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return 'Libra';
  if ((month === 10 && day >= 24) || (month === 11 && day <= 21)) return 'Scorpius';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricornus';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
  
  return '';
};

export const getZodiac = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Convert to YYYYMMDD integer for easy comparison
  const d = year * 10000 + month * 100 + day;

  // Custom data logic based on provided ranges
  if (d >= 20120123 && d <= 20130209) return 'Dragon';
  if (d >= 20130210 && d <= 20140130) return 'Snake';
  if (d >= 20140131 && d <= 20150218) return 'Horse';
  if (d >= 20150219 && d <= 20160207) return 'Goat'; // Also called Sheep
  if (d >= 20160209 && d <= 20170127) return 'Monkey'; // Assuming Feb 8 is Monkey too for continuity
  if (d >= 20170128 && d <= 20180215) return 'Rooster';
  if (d >= 20180216 && d <= 20190204) return 'Dog';
  if (d >= 20190205 && d <= 20200124) return 'Pig';
  if (d >= 20200125 && d <= 20210211) return 'Rat';
  if (d >= 20210212 && d <= 20220131) return 'Ox';
  if (d >= 20220201 && d <= 20230121) return 'Tiger';
  if (d >= 20230122 && d <= 20240209) return 'Rabbit'; 
  
  // Fallback to general modulo math for other years if outside the exact specified range
  const baseYear = 1924; // Year of the Rat
  const diff = year - baseYear;
  const cycle = ((diff % 12) + 12) % 12; // Handle negative differences safely
  
  const zodiacs = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
  
  // As Chinese New Year changes date, modulo is just an approximation for years not in the exact array.
  // For precise calculation over a larger range, a full calendar library is usually needed.
  return zodiacs[cycle];
};

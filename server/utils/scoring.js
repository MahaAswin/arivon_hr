/**
 * Deterministic Career Match Scoring Engine
 * 
 * Rules:
 * 1. Career Goal Match (+40)
 * 2. Interest Match (+25)
 * 3. Subject Match (+15)
 * 4. Skills Match (+10)
 * 5. Strength Alignment (+10)
 */
const calculateCareerMatch = (profile, career) => {
  let score = 0;

  const normalize = (val) => String(val || '').toLowerCase().trim();
  const careerName = normalize(career.name);
  const userGoal = normalize(profile.goal);

  // 1. Career Goal Match (+40)
  if (userGoal && (careerName.includes(userGoal) || userGoal.includes(careerName))) {
    score += 40;
  }

  // 2. Interest Match (+25)
  const interests = (profile.interests || []).map(normalize);
  if (interests.some(interest => careerName.includes(interest) || normalize(career.reason).includes(interest))) {
    score += 25;
  }

  // 3. Subject Match (+15)
  const subjects = (profile.favoriteSubjects || []).map(normalize);
  if (subjects.some(subject => careerName.includes(subject) || normalize(career.reason).includes(subject))) {
    score += 15;
  }

  // 4. Skills Match (+10)
  const skills = (profile.skills || []).map(normalize);
  const careerSkills = (career.skills_required || []).map(normalize);
  const hasSkillMatch = skills.some(skill => careerSkills.includes(skill));
  if (hasSkillMatch) {
    score += 10;
  }

  // 5. Strength Alignment (+10)
  const strengths = (profile.strengths || []).map(normalize);
  if (strengths.some(strength => normalize(career.reason).includes(strength))) {
    score += 10;
  }

  // UX Safety Rules: Clamp between 35 and 95, Rounding
  let finalScore = Math.round(score);
  
  // Ensure we don't return 0 unless absolutely no alignment
  if (finalScore < 35) finalScore = 35;
  if (finalScore > 95) finalScore = 95;

  return finalScore;
};

module.exports = { calculateCareerMatch };

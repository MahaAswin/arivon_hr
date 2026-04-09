const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const analyzeATS = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No resume file uploaded' });
    }

    console.log("ATS file:", req.file);
    const filePath = req.file.path;

    const dataBuffer = fs.readFileSync(filePath);
    console.log("PDF parsing started");
    const data = await pdfParse(dataBuffer);
    console.log("PDF parsed successfully");

    const rawText = data.text || "";
    const text = rawText.toLowerCase();
    console.log("Text length:", text.length);

    if (!rawText.trim()) {
      return res.status(400).json({ message: "No readable text found in the uploaded PDF. Please ensure it is a text-based resume, not a scanned image." });
    }

    // Load definitions
    const skillsPath = path.join(__dirname, '../utils/ats/data/skills.json');
    const rolesPath = path.join(__dirname, '../utils/ats/data/roles.json');
    
    let rawSkillsData = { domains: [] };
    let rawRolesData = { roles: [] };

    try {
      rawSkillsData = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));
      rawRolesData = JSON.parse(fs.readFileSync(rolesPath, 'utf8'));
    } catch (e) {
      console.error("Could not read config JSONs", e);
      return res.status(500).json({ message: "Server configuration missing ATS data files" });
    }

    const categoryScores = {};
    const categorizedSkills = {};

    // 1. Process Domain Skills
    rawSkillsData.domains.forEach(domain => {
      let key = domain.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (key.includes('data')) key = 'dataAI';
      if (domain.name === "Backend") key = "backend";
      if (domain.name === "Frontend") key = "frontend";
      if (domain.name === "Database") key = "database";
      if (domain.name === "DevOps") key = "devops";

      const matchedDomainSkills = [];
      const expectedDomainCount = domain.skills.length;

      domain.skills.forEach(skillDef => {
        const isMatched = skillDef.aliases.some(alias => text.includes(alias.toLowerCase()));
        if (isMatched) {
          matchedDomainSkills.push(skillDef.name);
        }
      });

      categorizedSkills[key] = matchedDomainSkills;
      categoryScores[key] = expectedDomainCount > 0 
        ? Math.round((matchedDomainSkills.length / expectedDomainCount) * 100) 
        : 0;
    });

    // 2. Process Role Ranking Logic
    const roleMatches = [];
    rawRolesData.roles.forEach(role => {
      const coreSkills = role.core || [];
      const optionalSkills = role.optional || [];
      const required = [...coreSkills, ...optionalSkills];

      const matchedCore = coreSkills.filter(kw => text.includes(kw.toLowerCase()));
      const matchedOptional = optionalSkills.filter(kw => text.includes(kw.toLowerCase()));

      let roleScore = 0;

      const coreWeight = 0.8;
      const optionalWeight = 0.2;

      const coreScoreRatio = coreSkills.length > 0 ? (matchedCore.length / coreSkills.length) : 0;
      const optionalScoreRatio = optionalSkills.length > 0 ? (matchedOptional.length / optionalSkills.length) : 0;

      let calculatedScore = (coreScoreRatio * coreWeight + optionalScoreRatio * optionalWeight) * 100;
      
      // Cap at 95
      calculatedScore = Math.min(calculatedScore, 95);

      // Apply penalty for missing core skills
      const missingCore = coreSkills.length - matchedCore.length;
      calculatedScore -= missingCore * 10;

      // Bound to zero minimum and round
      roleScore = Math.round(Math.max(calculatedScore, 0));

      console.log("Role:", role.name);
      console.log("Core Score:", coreScoreRatio);
      console.log("Optional Score:", optionalScoreRatio);
      console.log("Final Score:", roleScore);

      roleMatches.push({ 
        role: role.name, 
        score: roleScore, 
        requiredKw: required, 
        matchCount: matchedCore.length + matchedOptional.length 
      });
    });

    // Sort descending by score
    roleMatches.sort((a, b) => b.score - a.score);
    const topRoleData = roleMatches[0] || { role: "Software Engineer", score: 0, requiredKw: [], matchCount: 0 };
    const topRole = topRoleData.role;
    
    // Master Score
    const score = topRoleData.score; 

    // Score Grading
    let label = "Weak";
    let grade = "C";
    if (score >= 80) { label = "Strong Match"; grade = "A"; }
    else if (score >= 60) { label = "Good Match"; grade = "B"; }
    else if (score >= 40) { label = "Average"; grade = "C"; }

    // 3. Smart Missing Skills
    const unformattedMissing = topRoleData.requiredKw.filter(kw => !text.includes(kw.toLowerCase()));
    // Capitalize cleanly
    const missingSkills = unformattedMissing.slice(0, 8).map(str => str.charAt(0).toUpperCase() + str.slice(1));

    // 4. Dynamic Suggestions
    const suggestions = [];
    if (missingSkills.length > 0) {
      if (missingSkills.length > 1) {
        suggestions.push(`Consider adding projects highlighting ${missingSkills[0]} and ${missingSkills[1]}.`);
      } else {
        suggestions.push(`Your profile strongly matches, but adding ${missingSkills[0]} will complete your ${topRole} stack.`);
      }
    }
    
    // Identify lowest scoring category for advice
    const lowestCategory = Object.entries(categoryScores)
      .sort((a, b) => a[1] - b[1])
      .find(([k, v]) => v < 50);
      
    if (lowestCategory) {
      suggestions.push(`Your ${lowestCategory[0]} exposure is sitting at ${lowestCategory[1]}%. Try exploring more tools in this sector.`);
    } else if (score >= 80) {
      suggestions.push(`Exceptional coverage across domains. Fine-tune your achievements with hard metrics.`);
    }

    suggestions.push(`Ensure measurable technical impacts are featured heavily targeting a ${topRole} role.`);

    return res.json({
      score,
      grade,
      label,
      matchedCount: topRoleData.matchCount,
      missingCount: topRoleData.requiredKw.length - topRoleData.matchCount,
      categoryScores,
      categorizedSkills,
      roleMatches: roleMatches.map(r => ({ role: r.role, score: r.score })),
      missingSkills,
      suggestions,
      topRole
    });
  } catch (error) {
    console.error("Parsing failed:", error);
    return res.status(500).json({ message: 'Failed to analyze resume', error: error.message });
  }
};

module.exports = { analyzeATS };

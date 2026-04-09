export const skillCategories = {
  "Programming": [
    "JavaScript", "Python", "Java", "C++", "React", "Node.js",
    "TypeScript", "HTML", "CSS", "SQL", "Git", "Next.js", "Express"
  ],

  "Data Science": [
    "Machine Learning", "Data Analysis", "Pandas", "NumPy",
    "Statistics", "R", "Power BI", "Tableau", "Deep Learning", "NLP"
  ],

  "Design": [
    "UI/UX", "Figma", "Photoshop", "Illustrator",
    "After Effects", "Graphic Design", "Typography", "Wireframing"
  ],

  "Business": [
    "Marketing", "Finance", "Accounting", "Sales",
    "Digital Marketing", "SEO", "Project Management",
    "Business Strategy", "Entrepreneurship"
  ],

  "Soft Skills": [
    "Communication", "Leadership", "Problem Solving",
    "Public Speaking", "Teamwork", "Time Management",
    "Critical Thinking", "Adaptability"
  ],

  "Core Subjects": [
    "Mathematics", "Physics", "Chemistry", "Biology",
    "Economics", "History", "Psychology", "Political Science"
  ],

  "Engineering": [
    "Mechanical Engineering", "Electrical Engineering",
    "Civil Engineering", "Electronics", "CAD", "Robotics"
  ],

  "Medical & Healthcare": [
    "Anatomy", "Physiology", "Pharmacology",
    "Nursing", "Public Health", "Medical Coding"
  ],

  "Commerce": [
    "Tally", "GST", "Taxation", "Auditing",
    "Financial Analysis", "Stock Market"
  ],

  "Emerging Tech": [
    "Blockchain", "Cybersecurity", "Cloud Computing",
    "AWS", "DevOps", "IoT", "AR/VR"
  ],

  "Creative & Media": [
    "Content Writing", "Video Editing", "Photography",
    "Script Writing", "Animation", "Content Strategy"
  ]
};

export const allSkillsList = Object.values(skillCategories).flat();

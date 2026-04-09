class CareerModel:
    def __init__(self):
        # =====================================================================
        # DOMAIN-CATEGORIZED ROLE DATABASE
        # Each role belongs to a domain. Domain detection happens first,
        # so the user only ever sees careers relevant to their goal.
        # =====================================================================
        self.roles = [

            # --- TECHNOLOGY: SOFTWARE DEVELOPMENT ---
            {
                "id": "full_stack_dev",
                "role": "Full Stack Developer",
                "domain": "technology",
                "sub_domain": "software_development",
                "domain_keywords": ["developer", "software", "web", "full stack", "programming", "coder", "engineer", "tech"],
                "core_skills": ["javascript", "react", "node.js", "mongodb", "html", "css"],
                "secondary_skills": ["typescript", "docker", "aws", "git", "express", "rest api"],
                "interests": ["web development", "coding", "software", "innovation", "building apps", "programming"],
                "subjects": ["computer science", "mathematics", "logic", "data structures"]
            },
            {
                "id": "frontend_dev",
                "role": "Frontend Developer",
                "domain": "technology",
                "sub_domain": "software_development",
                "domain_keywords": ["developer", "frontend", "web", "ui", "react", "interface", "tech", "programming"],
                "core_skills": ["react", "javascript", "css", "html", "tailwind"],
                "secondary_skills": ["next.js", "typescript", "testing", "webpack", "vue", "angular"],
                "interests": ["visuals", "ux", "web design", "frontend", "user interface", "aesthetics"],
                "subjects": ["computer science", "web design", "human computer interaction"]
            },
            {
                "id": "backend_dev",
                "role": "Backend Developer",
                "domain": "technology",
                "sub_domain": "software_development",
                "domain_keywords": ["developer", "backend", "server", "api", "database", "software", "engineer", "tech"],
                "core_skills": ["node.js", "python", "sql", "apis", "databases", "express"],
                "secondary_skills": ["redis", "graphql", "kubernetes", "microservices", "docker"],
                "interests": ["servers", "architecture", "data management", "logic", "backend systems", "coding"],
                "subjects": ["algorithms", "databases", "networking", "computer science"]
            },
            {
                "id": "software_engineer",
                "role": "Software Engineer",
                "domain": "technology",
                "sub_domain": "software_development",
                "domain_keywords": ["software", "engineer", "development", "programmer", "developer", "tech", "coding"],
                "core_skills": ["java", "c++", "python", "algorithms", "data structures", "git"],
                "secondary_skills": ["design patterns", "system design", "agile", "testing", "ci/cd"],
                "interests": ["problem solving", "software engineering", "systems", "optimization", "coding"],
                "subjects": ["computer science", "mathematics", "algorithms", "operating systems"]
            },
            {
                "id": "devops_engineer",
                "role": "DevOps Engineer",
                "domain": "technology",
                "sub_domain": "software_development",
                "domain_keywords": ["devops", "infrastructure", "cloud", "deployment", "operations", "engineer", "tech"],
                "core_skills": ["docker", "kubernetes", "aws", "linux", "ci/cd", "bash"],
                "secondary_skills": ["terraform", "ansible", "jenkins", "monitoring", "networking"],
                "interests": ["infrastructure", "automation", "cloud", "systems reliability", "operations"],
                "subjects": ["networking", "operating systems", "computer science", "systems administration"]
            },

            # --- TECHNOLOGY: DATA / AI ---
            {
                "id": "data_scientist",
                "role": "Data Scientist",
                "domain": "technology",
                "sub_domain": "data_ai",
                "domain_keywords": ["data scientist", "machine learning", "ai", "artificial intelligence", "data", "ml", "deep learning"],
                "core_skills": ["python", "machine learning", "tensorflow", "statistics", "pandas", "numpy"],
                "secondary_skills": ["pytorch", "sklearn", "sql", "data visualization", "nlp", "deep learning"],
                "interests": ["ai", "machine learning", "data patterns", "research", "analytics", "artificial intelligence"],
                "subjects": ["statistics", "mathematics", "computer science", "linear algebra", "probability"]
            },
            {
                "id": "data_analyst",
                "role": "Data Analyst",
                "domain": "technology",
                "sub_domain": "data_ai",
                "domain_keywords": ["data analyst", "analytics", "data", "business intelligence", "bi analyst", "reporting"],
                "core_skills": ["python", "sql", "excel", "statistics", "data visualization"],
                "secondary_skills": ["tableau", "power bi", "pandas", "numpy", "r"],
                "interests": ["data", "analytics", "trends", "research", "business insights"],
                "subjects": ["statistics", "mathematics", "economics", "computer science"]
            },
            {
                "id": "ml_engineer",
                "role": "Machine Learning Engineer",
                "domain": "technology",
                "sub_domain": "data_ai",
                "domain_keywords": ["machine learning", "ml engineer", "ai engineer", "deep learning", "ai", "ml"],
                "core_skills": ["python", "tensorflow", "pytorch", "algorithms", "machine learning", "statistics"],
                "secondary_skills": ["mlops", "docker", "aws", "spark", "data pipelines"],
                "interests": ["machine learning", "ai research", "model building", "data science", "automation"],
                "subjects": ["mathematics", "statistics", "computer science", "linear algebra"]
            },

            # --- TECHNOLOGY: DESIGN ---
            {
                "id": "ui_ux_designer",
                "role": "UI/UX Designer",
                "domain": "technology",
                "sub_domain": "design",
                "domain_keywords": ["designer", "ui", "ux", "design", "user experience", "product designer", "interface design"],
                "core_skills": ["figma", "adobe xd", "wireframing", "prototyping", "user research"],
                "secondary_skills": ["photoshop", "illustrator", "accessibility", "visual design", "sketch"],
                "interests": ["design", "creativity", "art", "psychology", "user experience", "aesthetics"],
                "subjects": ["graphic design", "human computer interaction", "psychology", "visual arts"]
            },

            # --- BUSINESS & MANAGEMENT ---
            {
                "id": "product_manager",
                "role": "Product Manager",
                "domain": "business",
                "sub_domain": "management",
                "domain_keywords": ["product manager", "product", "business", "management", "pm", "product lead"],
                "core_skills": ["product strategy", "roadmapping", "user research", "agile", "data analysis"],
                "secondary_skills": ["sql", "figma", "jira", "stakeholder management", "a/b testing"],
                "interests": ["business strategy", "product", "innovation", "customer experience", "leadership"],
                "subjects": ["business", "economics", "computer science", "management", "marketing"]
            },
            {
                "id": "business_analyst",
                "role": "Business Analyst",
                "domain": "business",
                "sub_domain": "management",
                "domain_keywords": ["business analyst", "business", "analyst", "operations", "strategy", "consulting"],
                "core_skills": ["business analysis", "requirements gathering", "sql", "excel", "process modeling"],
                "secondary_skills": ["power bi", "jira", "agile", "erp", "project management"],
                "interests": ["business problems", "process improvement", "data", "strategy", "operations"],
                "subjects": ["business administration", "economics", "management", "information systems"]
            },
            {
                "id": "marketing_manager",
                "role": "Marketing Manager",
                "domain": "business",
                "sub_domain": "marketing",
                "domain_keywords": ["marketing", "digital marketing", "brand", "marketing manager", "growth hacker", "seo"],
                "core_skills": ["digital marketing", "seo", "content strategy", "social media", "analytics"],
                "secondary_skills": ["google ads", "email marketing", "copywriting", "crm", "market research"],
                "interests": ["marketing", "brand building", "customer psychology", "trends", "advertising"],
                "subjects": ["marketing", "business", "communications", "psychology", "economics"]
            },
            {
                "id": "financial_analyst",
                "role": "Financial Analyst",
                "domain": "business",
                "sub_domain": "finance",
                "domain_keywords": ["finance", "financial analyst", "investment", "accounting", "chartered accountant", "banking", "economist"],
                "core_skills": ["financial modeling", "excel", "accounting", "valuation", "statistics"],
                "secondary_skills": ["bloomberg", "power bi", "python", "sql", "investment analysis"],
                "interests": ["finance", "investment", "markets", "economics", "trading"],
                "subjects": ["finance", "economics", "accounting", "mathematics", "statistics"]
            },
            {
                "id": "entrepreneur",
                "role": "Entrepreneur / Startup Founder",
                "domain": "business",
                "sub_domain": "entrepreneurship",
                "domain_keywords": ["entrepreneur", "startup", "founder", "business owner", "ceo", "venture"],
                "core_skills": ["business strategy", "leadership", "product thinking", "fundraising", "networking"],
                "secondary_skills": ["marketing", "financial planning", "sales", "legal basics", "team building"],
                "interests": ["building companies", "innovation", "leadership", "problem solving", "venture"],
                "subjects": ["business administration", "economics", "management", "entrepreneurship"]
            },

            # --- MEDICAL & HEALTHCARE ---
            {
                "id": "doctor",
                "role": "Medical Doctor (MBBS/MD)",
                "domain": "medical",
                "sub_domain": "clinical",
                "domain_keywords": ["doctor", "physician", "medical", "mbbs", "medicine", "surgeon", "healthcare", "clinical", "md"],
                "core_skills": ["clinical diagnosis", "patient care", "pharmacology", "anatomy", "physiology"],
                "secondary_skills": ["surgery basics", "medical ethics", "ecg interpretation", "emergency care"],
                "interests": ["helping people", "health", "science", "biology", "patient care", "medicine"],
                "subjects": ["biology", "chemistry", "physics", "anatomy", "biochemistry"]
            },
            {
                "id": "nurse",
                "role": "Registered Nurse",
                "domain": "medical",
                "sub_domain": "clinical",
                "domain_keywords": ["nurse", "nursing", "healthcare", "medical", "patient care", "icu"],
                "core_skills": ["patient care", "clinical skills", "health assessment", "medication administration"],
                "secondary_skills": ["critical care", "wound care", "patient advocacy", "health documentation"],
                "interests": ["compassion", "helping patients", "health", "caregiving", "hospitals"],
                "subjects": ["biology", "chemistry", "anatomy", "nursing science", "psychology"]
            },
            {
                "id": "pharmacist",
                "role": "Pharmacist",
                "domain": "medical",
                "sub_domain": "pharmaceutical",
                "domain_keywords": ["pharmacist", "pharmacy", "drugs", "pharmacology", "medicine", "pharmaceutical"],
                "core_skills": ["pharmacology", "drug interactions", "patient counseling", "dispensing", "chemistry"],
                "secondary_skills": ["clinical pharmacy", "pharmacovigilance", "regulatory affairs"],
                "interests": ["medicine", "chemistry", "helping patients", "research", "health sciences"],
                "subjects": ["chemistry", "biology", "biochemistry", "pharmacology"]
            },
            {
                "id": "medical_researcher",
                "role": "Medical Researcher / Biomedical Scientist",
                "domain": "medical",
                "sub_domain": "research",
                "domain_keywords": ["medical researcher", "biomedical", "research", "lab scientist", "scientist", "clinical research"],
                "core_skills": ["research methodology", "lab techniques", "data analysis", "biology", "statistics"],
                "secondary_skills": ["python", "r", "grant writing", "clinical trials", "genetics"],
                "interests": ["research", "discovering cures", "science", "biology", "health innovation"],
                "subjects": ["biology", "biochemistry", "chemistry", "statistics", "genetics"]
            },

            # --- CREATIVE & ARTS ---
            {
                "id": "graphic_designer",
                "role": "Graphic Designer",
                "domain": "creative",
                "sub_domain": "visual_arts",
                "domain_keywords": ["graphic designer", "designer", "creative", "visual", "branding", "art director"],
                "core_skills": ["photoshop", "illustrator", "indesign", "typography", "color theory"],
                "secondary_skills": ["figma", "motion graphics", "branding", "print design", "logo design"],
                "interests": ["art", "creativity", "visual storytelling", "design", "aesthetics"],
                "subjects": ["fine arts", "graphic design", "visual communication", "art history"]
            },
            {
                "id": "content_creator",
                "role": "Content Creator / Digital Media",
                "domain": "creative",
                "sub_domain": "media",
                "domain_keywords": ["content creator", "youtuber", "social media", "influencer", "blogger", "content", "digital media"],
                "core_skills": ["video editing", "content writing", "social media", "storytelling", "photography"],
                "secondary_skills": ["seo", "analytics", "canva", "premiere pro", "brand partnerships"],
                "interests": ["creating content", "social media", "storytelling", "influence", "entertainment"],
                "subjects": ["communications", "media studies", "marketing", "journalism"]
            },
            {
                "id": "writer",
                "role": "Writer / Author / Journalist",
                "domain": "creative",
                "sub_domain": "writing",
                "domain_keywords": ["writer", "author", "journalist", "copywriter", "content writer", "editor", "blogger"],
                "core_skills": ["writing", "research", "editing", "storytelling", "grammar"],
                "secondary_skills": ["seo writing", "content strategy", "publishing", "social media writing"],
                "interests": ["writing", "storytelling", "reading", "journalism", "literature", "communication"],
                "subjects": ["english literature", "journalism", "communications", "history", "creative writing"]
            },

            # --- LEGAL & SOCIAL ---
            {
                "id": "lawyer",
                "role": "Lawyer / Legal Advisor",
                "domain": "legal",
                "sub_domain": "law",
                "domain_keywords": ["lawyer", "attorney", "legal", "law", "advocate", "barrister", "solicitor", "judge"],
                "core_skills": ["legal research", "case analysis", "argumentation", "contract law", "legal writing"],
                "secondary_skills": ["mediation", "court procedures", "compliance", "client advisory"],
                "interests": ["justice", "law", "debates", "social issues", "rights", "policy"],
                "subjects": ["law", "political science", "history", "ethics", "economics"]
            },
            {
                "id": "teacher",
                "role": "Teacher / Educator",
                "domain": "education",
                "sub_domain": "teaching",
                "domain_keywords": ["teacher", "educator", "professor", "lecturer", "tutor", "teaching", "trainer", "instructor"],
                "core_skills": ["curriculum design", "classroom management", "communication", "subject expertise", "mentoring"],
                "secondary_skills": ["e-learning", "assessment design", "counseling", "educational technology"],
                "interests": ["teaching", "education", "mentoring", "helping students", "shaping minds"],
                "subjects": ["education", "psychology", "communication", "subject specialization"]
            },
        ]

        # =====================================================================
        # DOMAIN KEYWORD MAPPING
        # Maps free-text goals to a primary domain
        # =====================================================================
        self.domain_map = {
            "technology": [
                "developer", "software", "engineer", "coding", "programmer", "tech",
                "frontend", "backend", "fullstack", "full stack", "web", "data scientist",
                "data analyst", "machine learning", "ai engineer", "devops", "cloud",
                "ui", "ux", "designer", "data", "ml", "deep learning", "cybersecurity",
                "android", "ios", "mobile", "react", "node", "python developer",
            ],
            "business": [
                "business", "marketing", "manager", "management", "finance", "financial",
                "analyst", "product manager", "entrepreneur", "startup", "founder",
                "sales", "accounting", "economics", "investment", "banking", "consulting",
                "operations", "strategy", "hr", "human resources",
            ],
            "medical": [
                "doctor", "physician", "medical", "surgeon", "nurse", "nursing",
                "healthcare", "pharmacist", "pharmacy", "mbbs", "clinical", "health",
                "dentist", "therapist", "psychiatrist", "biomedical", "researcher",
                "medicine", "lab", "hospital",
            ],
            "creative": [
                "designer", "graphic", "art", "creative", "artist", "illustrator",
                "content creator", "youtuber", "filmmaker", "photographer", "videographer",
                "writer", "author", "journalist", "blogger", "media", "animator",
                "fashion", "interior design",
            ],
            "legal": [
                "lawyer", "attorney", "legal", "law", "advocate", "judge", "barrister",
                "solicitor", "legal advisor", "compliance",
            ],
            "education": [
                "teacher", "professor", "lecturer", "educator", "tutor", "teaching",
                "trainer", "instructor", "academic",
            ],
        }

    def detect_domain(self, goal: str) -> str:
        """
        Detects the user's career domain from their stated goal.
        Returns a domain string like 'technology', 'business', 'medical', etc.
        Falls back to 'technology' if no domain is confidently detected.
        """
        if not goal:
            return None

        goal_lower = goal.lower()

        scores = {domain: 0 for domain in self.domain_map}

        for domain, keywords in self.domain_map.items():
            for kw in keywords:
                if kw in goal_lower:
                    # Exact phrase match scores higher than partial
                    scores[domain] += 2 if goal_lower == kw else 1

        best_domain = max(scores, key=scores.get)
        best_score = scores[best_domain]

        # If no domain keyword matched, return None (unknown domain)
        if best_score == 0:
            return None

        return best_domain

    def score_role_by_goal(self, goal: str, role: dict) -> int:
        """
        Scores how closely a specific role aligns with the user's exact goal.
        """
        if not goal:
            return 0
        goal_lower = goal.lower()
        role_lower = role["role"].lower()
        score = 0

        # Exact match
        if goal_lower == role_lower:
            score += 50
        # Goal is contained in role name (e.g., "developer" in "Full Stack Developer")
        elif goal_lower in role_lower:
            score += 35
        # Role name is contained in goal (e.g., "Full Stack Developer" goal, "Developer" role)
        elif role_lower in goal_lower:
            score += 30
        # Check role's domain keywords for partial matches
        else:
            for kw in role.get("domain_keywords", []):
                if kw in goal_lower:
                    score += 15
                    break

        return score

    def calculate_match(self, profile: dict) -> list:
        """
        Main entry point. Given a user profile:
        1. Detects their domain.
        2. Filters roles to only that domain.
        3. Scores and ranks roles by Goal, Skill, Interest alignment.
        4. Returns the top 5 ranked careers.
        """
        skills = [s.lower().strip() for s in profile.get("skills", [])]
        interests = [i.lower().strip() for i in profile.get("interests", [])]
        subjects = [s.lower().strip() for s in profile.get("favoriteSubjects", [])]
        strengths = [s.lower().strip() for s in profile.get("strengths", [])]
        goal = profile.get("goal", "").strip()

        # ---- STEP 1: DOMAIN DETECTION ----
        detected_domain = self.detect_domain(goal)

        # ---- STEP 2: FILTER ROLES BY DOMAIN ----
        if detected_domain:
            domain_roles = [r for r in self.roles if r["domain"] == detected_domain]
        else:
            # Fallback: use all roles if domain is unknown (discovery mode)
            domain_roles = self.roles

        # Safety: if somehow domain_roles is empty, use all roles
        if not domain_roles:
            domain_roles = self.roles

        # ---- STEP 3: SCORE EACH ROLE ----
        results = []

        for job in domain_roles:
            raw_score = 0

            # A. GOAL MATCH (Weight: 40 pts max)
            goal_score = self.score_role_by_goal(goal, job)
            raw_score += min(goal_score, 40)

            # B. SKILL MATCH (Weight: 30 pts max)
            matched_core = [s for s in skills if s in [sk.lower() for sk in job["core_skills"]]]
            matched_secondary = [s for s in skills if s in [sk.lower() for sk in job["secondary_skills"]]]
            core_count = len(job["core_skills"])
            skill_score = 0
            if core_count > 0:
                # Proportional match for core skills
                skill_score = (len(matched_core) / core_count) * 25
                skill_score += len(matched_secondary) * 1.5  # bonus for secondary
            raw_score += min(round(skill_score), 30)

            # C. INTEREST MATCH (Weight: 20 pts max)
            job_interests_lower = [i.lower() for i in job.get("interests", [])]
            interest_score = 0
            for interest in interests:
                for job_interest in job_interests_lower:
                    if interest in job_interest or job_interest in interest:
                        interest_score += 5
                        break
            raw_score += min(interest_score, 20)

            # D. SUBJECT MATCH (Weight: 10 pts max)
            job_subjects_lower = [s.lower() for s in job.get("subjects", [])]
            subject_score = 0
            for subject in subjects:
                for job_subject in job_subjects_lower:
                    if subject in job_subject or job_subject in subject:
                        subject_score += 3
                        break
            raw_score += min(subject_score, 10)

            results.append({
                "role": job["role"],
                "domain": job["domain"],
                "raw_score": raw_score,
                "matchedSkills": matched_core,
                "missingCoreSkills": [s for s in job["core_skills"] if s.lower() not in skills],
                "missingSecondarySkills": [s for s in job["secondary_skills"] if s.lower() not in skills],
                "strengths": matched_core
            })

        # ---- STEP 4: SORT BY SCORE ----
        results.sort(key=lambda x: x["raw_score"], reverse=True)

        # ---- STEP 5: RELATIVE NORMALIZATION WITH UX CLAMPING ----
        # Ensure scores are realistic and encouraging (55–95 range)
        max_raw = max([r["raw_score"] for r in results], default=1)
        if max_raw == 0:
            max_raw = 1

        for r in results:
            normalized = (r["raw_score"] / max_raw) * 100
            # Clamp to UX-friendly range: 55–95
            final_score = max(55, min(round(normalized), 95))
            r["match"] = final_score

            # Match level labels
            if final_score >= 80:
                r["matchLevel"] = "Strong Match"
            elif final_score >= 65:
                r["matchLevel"] = "Good Match"
            else:
                r["matchLevel"] = "Growth Match"

        # Guarantee: top result gets at least a Strong Match label
        if results and results[0]["match"] < 80:
            results[0]["match"] = 85
            results[0]["matchLevel"] = "Strong Match"

        return results[:5]


career_engine = CareerModel()

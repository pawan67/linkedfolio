import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://linkedfolio.vercel.app",
    "X-Title": "LinkedFolio",
  },
});

export async function callOpenRouterForProfile(pdfText: string) {
  const prompt = `### **AI Prompt for LinkedIn PDF to Structured JSON**
**Task:** Extract and structure data from a LinkedIn PDF into a clean JSON format based on the following schema. Only return the JSON—no explanations or additional text.

#### **Required Fields:**
1. **bio**
   - this will short bio of the user in 100 words.

2. **socials** (Array of objects) check for only github, linkedin, portfolio, phone, mail  
   - url: Social profile link (e.g., LinkedIn, GitHub, Portfolio) with full link including https:// and respective for mail and phone
   - icon: icon name {
   "github": "mdi:github",
   "linkedin": "mdi:linkedin",
   "portfolio": "mdi:globe",
   "mail": "mdi:email",
   "phone": "mdi:phone",
   }

3. **skills** (Array of objects)
   - name: Skill name (e.g., "JavaScript", "React").

4. **experiences** (Array of objects)
   - role: Job title.
   - company: Employer name.
   - description: Job responsibilities (use role if no description is available).
   - from: Start date (YYYY-MM-DD).
   - to: End date (YYYY-MM-DD, omit or set to null if current role).
   - isCurrent: Boolean (true if current role).
   - location: Work location (city/country).

5. **projects** (Array of objects)
   - name: Project title.
   - url: Project link (if available).
   - description: Brief explanation.

6. **name**
   - name: name of the user.

7. **location**
   - location: location of the user.

8. **about**
   - about: summarize the user for about section.

9. **slug**
   - slug: slug just first name.

10. **education** (Array of objects)
   - degree: Degree name.
   - institution: Institution name.
   - from: Start date (YYYY-MM-DD).
   - to: End date (YYYY-MM-DD, omit or set to null if current role).
   - location: Education location (city/country).
   - description: Education description.

#### Rules:
- Extract only the structured data—ignore fillers (e.g., "See more," "Page 1 of 2").
- If a field is missing, use null or [] (empty array for arrays).
- Normalize dates to YYYY-MM-DD.
- Group similar entities (e.g., social links separately).
- bio should be short and catchy this is for the header section. and about should be long and detailed this is for the about section.

---
The text to be processed is:
${pdfText}
---
`;

  const completion = await openai.chat.completions.create({
    model: "mistralai/mistral-small-3.2-24b-instruct-2506:free",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
  });

  const content = completion.choices[0].message.content;
  // Extract JSON from the LLM response (may need to parse from markdown/code block)
  const match = content?.match(/```json\s*([\s\S]+?)```/i);
  const profileJson = match ? match[1] : content;
  try {
    return JSON.parse(profileJson || "{}");
  } catch {
    return { error: "Failed to parse profile JSON", raw: profileJson };
  }
}

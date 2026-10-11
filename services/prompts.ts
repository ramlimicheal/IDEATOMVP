export const PROMPTS = {
  parser: (idea: string) => `
    You are an expert product strategist. Analyze this micro-SaaS idea and extract the core components.
    
    IDEA:
    ${idea}
    
    Provide a structured analysis with:
    1. **Problem Statement**: What specific pain point does this solve?
    2. **Target Audience**: Who exactly needs this?
    3. **Core Value Proposition**: What's the unique value?
    4. **Key Features**: Top 3-5 must-have features
    5. **Business Model**: How will this make money?
    6. **Viral/Growth Mechanism**: Built-in growth loops?
    
    Be concise but thorough. Use real-world context.
  `,

  market: (idea: string, parsed: string) => `
    You are a market research analyst with access to current market data. Analyze the market potential for this product idea.
    
    PRODUCT ANALYSIS:
    ${parsed}
    
    ORIGINAL IDEA:
    ${idea}
    
    Research and provide:
    1. **Market Size**: Estimate TAM, SAM, SOM with reasoning.
    2. **Market Trends**: Current trends supporting or threatening this idea.
    3. **Growth Rate**: Industry growth projections.
    4. **Timing Assessment**: Is now the right time? Why?
    5. **Geographic Opportunities**: Best markets to launch.
    6. **Pricing Benchmarks**: What similar solutions charge.
    
    Use specific numbers and real market data where possible. Be realistic, not optimistic.
  `,

  competitor: (idea: string, parsed: string) => `
    You are a competitive intelligence analyst. Find and analyze real competitors for this product idea.
    
    PRODUCT ANALYSIS:
    ${parsed}
    
    ORIGINAL IDEA:
    ${idea}
    
    Research and identify:
    1. **Direct Competitors**: Products solving the exact same problem.
    2. **Indirect Competitors**: Alternative solutions users currently use.
    3. **Competitor Strengths**: What they do well.
    4. **Competitor Weaknesses**: Where they fall short.
    5. **Market Gaps**: Opportunities they're missing.
    6. **Differentiation Strategy**: How to stand out.
    
    Be specific with competitor names and their actual features. This must be based on real market research.
  `,

  platform: (parsed: string, market: string, competitors: string) => `
    You are a technical product strategist. Recommend the optimal platform and delivery method for this product.
    
    PRODUCT ANALYSIS:
    ${parsed}
    
    MARKET CONTEXT:
    ${market}
    
    COMPETITIVE LANDSCAPE:
    ${competitors}
    
    Analyze and recommend:
    1. **Primary Platform**: Web App, Mobile App, Chrome Extension, Desktop App, API/SDK, or combination.
    2. **Platform Justification**: Why this platform suits the use case.
    3. **Tech Stack Recommendation**: Suggested technologies.
    4. **MVP Scope**: Minimum features for launch.
    5. **Development Timeline**: Realistic estimate.
    6. **Launch Strategy**: Where and how to launch first.
    7. **Monetization Implementation**: How to implement the business model.
    
    Consider user behavior, competitor platforms, and development efficiency.
  `,

  validation: (allAnalysis: string) => `
    You are a startup validation expert. Score this idea objectively based on all analysis.
    
    COMPLETE ANALYSIS:
    ${allAnalysis}
    
    Provide a validation assessment:
    
    1. **Overall Viability Score**: X/100
    2. **Market Score**: X/100 (size, timing, trends)
    3. **Competition Score**: X/100 (differentiation potential)
    4. **Feasibility Score**: X/100 (technical, resource requirements)
    
    For each score, provide:
    - The numeric score
    - Key factors influencing the score
    - Risks and mitigations
    
    5. **Go/No-Go Recommendation**: Clear verdict with reasoning.
    6. **Critical Success Factors**: What must go right.
    7. **Biggest Risks**: What could kill this.
    
    IMPORTANT: Output the scores in this exact format at the very start of your response:
    SCORES: overall=XX, market=XX, competition=XX, feasibility=XX
    
    Be brutally honest. A mediocre idea should score mediocre.
  `,

  prd: (idea: string, allAnalysis: string) => `
    You are a senior product manager. Create a comprehensive Product Requirements Document (PRD) based on all the analysis.
    
    COMPLETE ANALYSIS:
    ${allAnalysis}
    
    ORIGINAL IDEA:
    ${idea}
    
    Generate a complete PRD with these sections:
    
    # Product Requirements Document
    
    ## 1. Executive Summary
    - Product vision
    - Key value proposition
    - Target launch date
    
    ## 2. Problem Statement
    - User pain points
    - Current solutions and gaps
    - Why now
    
    ## 3. Target Users
    - Primary persona
    - Secondary personas
    - User journey
    
    ## 4. Product Overview
    - Core features (prioritized)
    - User stories
    - Success metrics
    
    ## 5. Technical Requirements
    - Platform specifications
    - Technology stack
    - Integration requirements
    - Security considerations
    
    ## 6. Go-to-Market Strategy
    - Launch plan
    - Pricing strategy
    - Marketing channels
    - Growth tactics
    
    ## 7. Competitive Positioning
    - Key differentiators
    - Competitive advantages
    - Market positioning
    
    ## 8. Success Metrics & KPIs
    - North star metric
    - Supporting metrics
    - Milestone targets
    
    ## 9. Risks & Mitigations
    - Technical risks
    - Market risks
    - Mitigation strategies
    
    ## 10. Roadmap
    - MVP (Month 1-2)
    - V1.0 (Month 3-4)
    - V2.0 (Month 5-6)
    
    ## 11. Resource Requirements
    - Team composition
    - Budget estimate
    - Timeline
    
    Make this actionable and specific to the product. Include real competitor names and market data where relevant.
  `
};

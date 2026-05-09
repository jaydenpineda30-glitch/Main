# Jayden's Dashboard — Project Context

## About this project
Personal life dashboard built as a **single self-contained HTML file** (`dashboard.html`).
Uses React 18 via CDN + Babel standalone — no build step, no npm, no framework.
Glass/futuristic UI theme: deep space background, neon purple accent (#c77dff), frosted glass cards.

## Current sections
- Dashboard (weekly calendar, check-in, assessments, tasks overview)
- Uni (subject progress, class schedule, assessments)
- Work (GoTab shift pay calculator)
- Gym (exercise tracking, rotation, body weight)
- Personal (task manager, knowledge base)
- Finance (income + expense tracking, category breakdown, 6-month forecast)
- Reflection (weekly review)

## User environment
- **OS:** Windows — no WSL installed
- **Cannot** access Linux file paths directly (e.g. /home/user/Main/...)
- **File delivery:** Always provide files via GitHub raw download link so Jayden can Ctrl+S to save
- GitHub repo: `jaydenpineda30-glitch/Main`, branch: `claude/add-ui-component-dqFqx`
- Raw download URL format: `https://github.com/jaydenpineda30-glitch/Main/raw/claude/add-ui-component-dqFqx/dashboard.html`

## Communication style
- Keep explanations simple and step-by-step — avoid technical jargon
- When giving instructions, number each step clearly
- Don't overwhelm with options — recommend one clear path
- Always commit + push changes so Jayden can download the updated file from GitHub

## Code conventions
- All styles are inline React style objects (no external CSS classes except for animations)
- Theme colours live in the `T` object at the top of the script
- New page sections follow the same pattern: add to nav array, add component/render block, add state handler in App
- Data persists via localStorage under key `dash_v1`
- Finance income sources: GoTab Shifts + 2 others (user names them)
- Expense categories: Bills, Addiction, Other

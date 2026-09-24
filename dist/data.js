import {expandCatalog} from './expanded.js';
export const checked = '2026-09-24';
export const sources = {
  coding: 'https://livebench.ai/',
  architecture: 'https://arxiv.org/html/2604.06683v1#S4.T3',
  availability: 'https://docs.github.com/en/copilot/reference/ai-models/supported-models',
  pricing: 'https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing',
  qna: 'https://labs.scale.com/leaderboard/sweatlas-qna',
  tests: 'https://labs.scale.com/leaderboard/sweatlas-tw',
  refactor: 'https://labs.scale.com/leaderboard/sweatlas-refactoring',
  terminal: 'https://www.tbench.ai/news/terminal-bench-2-1',
  verified: 'https://www.swebench.com/',
  pro: 'https://labs.scale.com/leaderboard/swe_bench_pro'
};
export const benchmarks = [
  {id:'coding',short:'General coding',name:'LiveBench · Coding',unit:'/100',subtitle:'LiveBench · Coding',description:'General coding: writing new code and completing existing code. Uses the LiveBench Coding category average.',version:'LiveBench-2026-06-25',note:'Published coding category average on a 0–100 scale. Reasoning settings are retained per model. This is not a repository-level feature implementation benchmark.'},
  {id:'architecture',short:'Architecture',name:'R2ABench · Architecture diagrams',unit:'/100',subtitle:'R2ABench · Node F1',description:'Generate architecture diagrams from full product requirements. Shows component-recognition Node F1 × 100.',version:'Paper v1 · Table 3 · Full PRD · Direct',note:'Narrow architecture-generation measure, not an overall system-design score. Only Sonnet 4.6 overlaps this catalog. Node F1 is scaled from 0–1 to 0–100; relationship quality and other metrics are in model evidence. Architecture understanding remains a separate Codebase Q&A column.'},
  {id:'qna',short:'Codebase Q&A',name:'SWE Atlas · Codebase QnA',description:'Deep understanding of production codebases. Task resolve rate.',version:'Published leaderboard snapshot',note:'Agent and reasoning settings vary. July 28 update increased mini-SWE-agent steps for newer models. Some entries have refusal-related failures.'},
  {id:'tests',short:'Test writing',name:'SWE Atlas · Test Writing',description:'Tests that pass execution, mutation checks and mandatory rubrics.',version:'Published leaderboard snapshot',note:'Dataset was updated July 28 to reduce solution lookup; budgets differ by entry. Results average three trials.'},
  {id:'refactor',short:'Refactoring',name:'SWE Atlas · Refactoring',description:'Behavior-preserving code restructuring with tests and rubric checks.',version:'Published leaderboard snapshot',note:'Published agent-model results, with varying reasoning settings. Not a Copilot evaluation.'},
  {id:'terminal',short:'Terminal',name:'Terminal-Bench 2.1',description:'End-to-end tasks in a terminal environment.',version:'2.1',note:'Fixed version 2.1 comparison, not the latest Terminal-Bench edition. Main table uses Terminus 2; native CLI results are shown in evidence.'},
  {id:'verified',short:'Fixing bugs',name:'SWE-bench Verified · Bash Only',description:'Resolution of real repository issues.',version:'Verified / mini-SWE-agent 2.0.0',note:'Only the verified common-agent results captured in this snapshot are included. Vendor headline scores are not substituted.'},
  {id:'pro',short:'Complex code changes',name:'SWE-Bench Pro · Public',description:'Challenging software issue resolution on the public dataset.',version:'Original public leaderboard (not V2)',note:'GPT-5.4 uses mini-SWE-agent; Haiku uses a different setup. Version and agent differences must be considered.'}
];
// Prices: USD / 1M tokens. No inferred API-to-Copilot price mapping.
const rows = [
 ['GPT-5 mini','OpenAI',.25,.025,null,2],['GPT-5.3-Codex','OpenAI',1.75,.175,null,14],
 ['GPT-5.4','OpenAI',2.5,.25,null,15,272,5,.5,null,22.5],['GPT-5.4 mini','OpenAI',.75,.075,null,4.5],['GPT-5.4 nano','OpenAI',.2,.02,null,1.25],
 ['GPT-5.5','OpenAI',5,.5,null,30,272,10,1,null,45],['GPT-5.6 Luna','OpenAI',.2,.02,.25,1.2,200,.4,.04,.5,1.8],
 ['GPT-5.6 Sol','OpenAI',4,.4,5,20,272,8,.8,10,30],['GPT-5.6 Terra','OpenAI',2,.2,2.5,12,272,4,.4,5,18],
 ['GPT-6 Astra','OpenAI',10,1,12.5,50,272,20,2,25,75],['GPT-6 Luna','OpenAI',.1,.01,.125,.5,272,.2,.02,.25,.75],['GPT-6 Sol','OpenAI',2,.2,2.5,10,272,4,.4,5,15],
 ['Claude Haiku 4.5','Anthropic',1,.1,1.25,5],['Claude Sonnet 4.6','Anthropic',3,.3,3.75,15],['Claude Sonnet 5','Anthropic',2,.2,2.5,10],
 ['Claude Opus 4.7','Anthropic',5,.5,6.25,25],['Claude Opus 4.8','Anthropic',5,.5,6.25,25],['Claude Opus 4.8 (fast mode)','Anthropic',10,1,12.5,50],
 ['Claude Opus 5','Anthropic',5,.5,6.25,25],['Claude Opus 5.5','Anthropic',4,.2,5,20],['Claude Fable 5','Anthropic',10,1,12.5,50],['Claude Fable 5.1','Anthropic',10,.25,12.5,50],
 ['Gemini 3.5 Flash','Google',1.5,.15,null,9],['Gemini 3.6 Flash','Google',.75,.075,null,3.75],['Gemini 3.7 Flash','Google',.75,.075,null,3.75],['Gemini 3.8 Flash','Google',.75,.075,null,3.75],
 ['MAI-Code-1.1-Flash','Microsoft',.2,.02,null,1.2],['Kimi K2.7 Code','Moonshot AI',.95,.19,null,4],['Kimi K3','Moonshot AI',3,.3,null,15],
 ['Grok 4.5','xAI',2,.5,null,6,200,4,1,null,12],['Grok 4.6','xAI',2,.5,null,6,200,4,1,null,12],['Grok 4.7','xAI',2,.5,null,6,200,4,1,null,12],
 ['GPT-4o','OpenAI',null,null,null,null],['GPT-4o mini','OpenAI',null,null,null,null],['GPT-4.1','OpenAI',null,null,null,null]
];
export const models = rows.map(([name,provider,input,cached,write,output,threshold,li,lc,lw,lo])=>({id:name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),name,provider,price:{input,cached,write,output},long:threshold?{threshold:threshold*1000,input:li,cached:lc,write:lw,output:lo}:null,utility:['GPT-5.4 nano','GPT-4o','GPT-4o mini','GPT-4.1'].includes(name),evidence:{},alternatives:[],notes:[]}));
const get = name=>models.find(m=>m.name===name);
for(const [name,value,setting] of [
 ['Claude Fable 5.1',86.4,'Max Effort'],['Claude Opus 5.5',89.3,'Thinking Max Effort'],['Claude Fable 5',86,'Max Effort'],
 ['GPT-6 Astra',80.4,'Max Effort'],['GPT-5.6 Sol',83.9,'Max Effort'],['GPT-5.5',82.1,'Thinking xHigh Effort'],
 ['Claude Opus 5',81.4,'Thinking Max Effort'],['Kimi K3',81.4,'not specified'],['Gemini 3.7 Flash',78.9,'High'],
 ['Grok 4.6',76.8,'not specified'],['GPT-5.4',77.5,'Thinking xHigh Effort'],['GPT-5.6 Terra',78.2,'Max Effort'],
 ['Grok 4.7',77.2,'xHigh'],['GPT-5.4 nano',70.8,'xHigh'],['Kimi K2.7 Code',74,'not specified'],['GPT-5.4 mini',71.6,'xHigh']
]) get(name).evidence.coding={value,agent:'LiveBench evaluation · '+setting,date:null,source:sources.coding};
get('Claude Sonnet 4.6').evidence.architecture={value:54.13,agent:'Direct generation from full PRD · Node F1 × 100',date:null,source:sources.architecture};
get('Claude Sonnet 4.6').notes.push('R2ABench, Full PRD / Direct: Node F1 0.5413; Edge F1 0.0855; layer accuracy 0.7209; syntactic validity 0.8235. The table shows Node F1 × 100 only, not an overall architecture score. MetaGPT and OpenHands results are different evaluation setups.');
const atlas = [
 ['GPT-6 Astra','Codex · xHigh',[59.14,4.88],[50.74,5.91],[59.05,6.43]],
 ['Claude Fable 5.1','Claude Code · xHigh',[59.95,4.85],[67.04,5.33],[56.67,6.52]],
 ['Claude Fable 5','Claude Code · xHigh',[39,5],[55.6,5.8],[54.76,6.76]],
 ['Claude Opus 5','Claude Code · xHigh',[63.17,5.01],[62.22,5.58],null],
 ['Claude Opus 4.8','Claude Code · xHigh where specified',[57.26,4.93],[49.63,5.93],[46.67,6.75]],
 ['Claude Opus 4.7','Claude Code · effort not specified',[40.32,5.06],[38.52,5.93],[48.57,6.73]],
 ['GPT-5.6 Sol','Codex · xHigh',[46,5],[45.9,6],null],
 ['GPT-5.5','Codex · xHigh',[45.43,5.08],[42.59,5.96],[44.79,6.76]],
 ['GPT-5.4','Codex · xHigh',[40.8,5.1],[44.36,6.04],[44.29,6.76]],
 ['GPT-5.3-Codex','Codex · xHigh',[32.6,4.9],[38.98,6.12],[42.38,6.76]],
 ['Claude Sonnet 4.6','Claude Code · effort not specified',[31.2,5],[31.76,6.24],[32.21,6.77]],
 ['Gemini 3.8 Flash','Mini-SWE-Agent · effort not specified',[47.04,5.08],[53.7,5.86],[44.76,6.76]]
];
for(const [name,agent,...values] of atlas) values.forEach((v,i)=>{if(v)get(name).evidence[['qna','tests','refactor'][i]]={value:v[0],uncertainty:v[1],agent,date:null,source:sources[['qna','tests','refactor'][i]]};});
for(const [name,value,native,agent] of [['GPT-5.3-Codex',68.5,79.1,'Codex CLI'],['GPT-5.4',54.8,77.3,'Codex CLI'],['GPT-5.4 mini',36.9,66.1,'Codex CLI'],['Claude Sonnet 4.6',51.5,58.5,'Claude Code']]) {
 get(name).evidence.terminal={value,agent:'Terminus 2',date:null,source:sources.terminal};
 get(name).alternatives.push({benchmark:'terminal',value:native,agent,date:null,source:sources.terminal});
}
get('GPT-5.4').alternatives.push({benchmark:'qna',value:36.3,uncertainty:4.9,agent:'Mini-SWE-Agent · xHigh',source:sources.qna},{benchmark:'tests',value:40,uncertainty:6,agent:'Mini-SWE-Agent · xHigh',source:sources.tests});
get('Claude Haiku 4.5').evidence.verified={value:66.6,agent:'mini-SWE-agent 2.0.0 · high',date:'2026-02-17',source:sources.verified};
get('GPT-5 mini').evidence.verified={value:56.2,agent:'mini-SWE-agent 2.0.0',date:'2026-02-17',source:sources.verified};
get('GPT-5.4').evidence.pro={value:59.1,uncertainty:3.56,agent:'mini-SWE-agent · xHigh',date:null,source:sources.pro};
get('Claude Haiku 4.5').evidence.pro={value:39.45,uncertainty:3.55,agent:'SWE-agent · see source for budget',date:null,source:sources.pro};
for(const m of models){
 if(m.name.startsWith('Gemini 3.') && !m.name.includes('3.5'))m.notes.push('Promotional Copilot pricing through December 31, 2026.');
 if(m.utility)m.notes.push('Utility model: powers background features; not a selectable model in the picker.');
 if(m.name.includes('fast mode'))m.notes.push('GitHub lists GA status while retaining “preview” in the model name.');
 if(['Claude Fable 5','GPT-5.6 Sol'].includes(m.name))m.notes.push('Scale reports elevated refusal-related failures for this model on parts of SWE Atlas; included in published scores.');
 if(m.name==='GPT-5.3-Codex')m.notes.push('Scale abbreviates this entry as “GPT 5.3 (Codex)”.');
}
expandCatalog(benchmarks,sources,models);

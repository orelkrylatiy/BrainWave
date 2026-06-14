import { readFile } from 'node:fs/promises';

const event = JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, 'utf8'));
const token = process.env.GITHUB_TOKEN;
const openAiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || 'gpt-5-mini';

if (!token) {
  throw new Error('GITHUB_TOKEN is required.');
}

if (!openAiKey) {
  throw new Error('OPENAI_API_KEY repository secret is required.');
}

const pr = event.pull_request;
const repo = event.repository;

if (!pr || !repo) {
  throw new Error('This script must run on a pull_request_target event.');
}

const apiBase = repo.url;
const headers = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
  'X-GitHub-Api-Version': '2022-11-28',
};

async function github(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API request failed: ${response.status} ${body}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function readOptionalFile(path) {
  try {
    return await readFile(path, 'utf8');
  } catch {
    return '';
  }
}

async function getPullRequestDiff() {
  const response = await fetch(`${apiBase}/pulls/${pr.number}`, {
    headers: {
      ...headers,
      Accept: 'application/vnd.github.v3.diff',
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to fetch PR diff: ${response.status} ${body}`);
  }

  const diff = await response.text();
  return diff.length > 180_000 ? `${diff.slice(0, 180_000)}\n\n[Diff truncated for length.]` : diff;
}

function extractOutputText(payload) {
  if (typeof payload.output_text === 'string') {
    return payload.output_text.trim();
  }

  const parts = [];
  for (const item of payload.output || []) {
    for (const content of item.content || []) {
      if (content.type === 'output_text' && content.text) {
        parts.push(content.text);
      }
    }
  }

  return parts.join('\n').trim();
}

async function generateDescription({ diff, guide, copilotInstructions }) {
  const prompt = [
    'Generate a concise GitHub pull request description from the provided PR diff.',
    '',
    'Return only Markdown with exactly these sections:',
    '',
    '## What was done',
    '',
    '## Why',
    '',
    '## How to check',
    '',
    '## Screenshots / Demo',
    '',
    'Rules:',
    '- Be specific, but do not invent facts that are not visible in the diff.',
    '- Use bullet points under What was done and Why.',
    '- Use a numbered list under How to check.',
    '- If there are no UI changes or no visible demo artifact, write: Not applicable.',
    '- Do not include the checklist.',
    '- Do not include code fences around the final answer.',
    '',
    'Repository review guide:',
    guide || 'No review guide found.',
    '',
    'Repository Copilot instructions:',
    copilotInstructions || 'No Copilot instructions found.',
    '',
    'PR title:',
    pr.title,
    '',
    'PR diff:',
    diff,
  ].join('\n');

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openAiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: prompt,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI API request failed: ${response.status} ${body}`);
  }

  const payload = await response.json();
  const text = extractOutputText(payload);

  if (!text) {
    throw new Error('OpenAI returned an empty PR description.');
  }

  return text;
}

function updateBody(currentBody, generated) {
  const start = '<!-- ai-pr-description:start -->';
  const end = '<!-- ai-pr-description:end -->';
  const replacement = `${start}\n\n${generated}\n\n${end}`;

  if (currentBody.includes(start) && currentBody.includes(end)) {
    return currentBody.replace(
      new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`),
      replacement,
    );
  }

  return `${replacement}\n\n${currentBody || ''}`.trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const [diff, guide, copilotInstructions] = await Promise.all([
  getPullRequestDiff(),
  readOptionalFile('docs/review/code-review-guide.md'),
  readOptionalFile('.github/copilot-instructions.md'),
]);

const generated = await generateDescription({
  diff,
  guide,
  copilotInstructions,
});

const latestPr = await github(`/pulls/${pr.number}`);
const updatedBody = updateBody(latestPr.body || '', generated);

if (updatedBody !== (latestPr.body || '')) {
  await github(`/pulls/${pr.number}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ body: updatedBody }),
  });
}

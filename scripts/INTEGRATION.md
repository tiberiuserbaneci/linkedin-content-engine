# Integration Guide: Claude Code + Vercel + Git + Supabase

Your complete architecture for Ultron LinkedIn content automation.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           YOUR WORKFLOW                                     │
└─────────────────────────────────────────────────────────────────────────────┘

CHAT (You type concept)
    ↓
CLAUDE CODE (Python pipeline runs)
├─ batch_generator.py → 5 HTML variants
├─ export_playwright.py → PNG @ 1080×1350 @ 144dpi
├─ scoring.py → 360Brew scores
├─ db_sync.py → save to Supabase
└─ /outputs/ → 5 PNG files
    ↓
VERCEL DASHBOARD (review, download, post)
├─ Preview variants
├─ Download PNGs
├─ Copy post copy + first comment
└─ Track reach
    ↓
SUPABASE DATABASE (persistent storage)
├─ variants table (HTML, scores, metadata)
├─ posts table (post copy, reach, linkedin_post_id)
└─ exports table (PNG, PDF file tracking)
    ↓
GIT REPO (backup, version control)
└─ /scripts/ with all Python code
```

---

## 1. Git Integration

### Setup (one-time)

Clone your repo locally:
```bash
git clone https://github.com/your-org/linkedin-content-engine.git
cd linkedin-content-engine
```

Copy scripts into `/scripts/` directory:
```bash
cp -r /path/to/scripts/* ./scripts/
```

Commit:
```bash
git add scripts/
git commit -m "Add Claude Code LinkedIn content engine pipeline"
git push
```

### File Structure in Git

```
linkedin-content-engine/
├── .env.local                 # Your secrets (never commit)
├── .gitignore                 # Exclude .env, node_modules, outputs/
├── scripts/                   # All Python modules
│   ├── main.py
│   ├── batch_generator.py
│   ├── export_playwright.py
│   ├── scoring.py
│   ├── design_system.py
│   ├── db_sync.py
│   ├── requirements.txt
│   ├── README.md
│   └── QUICKSTART.md
├── api/                       # Vercel API routes
│   ├── generate-variants.ts
│   ├── get-variants.ts
│   ├── save-post.ts
│   └── ...
├── pages/                     # React pages
│   ├── dashboard.tsx
│   ├── preview/[id].tsx
│   └── ...
├── vercel.json                # Vercel config
└── package.json
```

### .gitignore

```
.env.local
outputs/
*.pyc
__pycache__/
.pytest_cache/
node_modules/
.next/
.vercel/
```

### Auto-commit variants (optional)

After batch generation, auto-push to GitHub:

```python
import subprocess

def commit_variants(batch_id, concepts):
    """Auto-commit PNG exports to Git"""
    subprocess.run([
        'git', 'add', 'outputs/',
        '-m', f'Add variants for: {", ".join(concepts)}'
    ])
    subprocess.run(['git', 'push'])
```

---

## 2. Vercel Integration

### API Routes

Create Vercel API endpoints in `pages/api/`:

#### `/api/generate-variants.ts`

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { concept, numVariants = 5 } = req.body;

  if (!concept) {
    return res.status(400).json({ error: 'Concept required' });
  }

  try {
    // Call Claude Code via subprocess (Vercel serverless)
    // OR call a scheduled job that runs the Python script
    
    // For now, return a queue/job ID
    const jobId = crypto.randomUUID();
    
    // Store job in Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
    
    await supabase.from('generation_jobs').insert({
      id: jobId,
      concept,
      num_variants: numVariants,
      status: 'queued',
      created_at: new Date()
    });

    res.json({
      success: true,
      jobId,
      message: 'Batch queued for generation'
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
```

#### `/api/get-variants.ts`

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { concept, limit = 10 } = req.query;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  let query = supabase
    .from('variants')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit as number);

  if (concept) {
    query = query.eq('concept', concept);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ variants: data });
}
```

#### `/api/save-post.ts`

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { variantId, postCopy, firstComment, linkedinPostId } = req.body;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { data, error } = await supabase
    .from('posts')
    .insert({
      variant_id: variantId,
      post_copy: postCopy,
      first_comment: firstComment,
      linkedin_post_id: linkedinPostId,
      posted_at: new Date(),
      created_at: new Date()
    });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ success: true, postId: data?.[0]?.id });
}
```

### Dashboard Pages

#### `/pages/dashboard.tsx`

```typescript
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Variant {
  id: string;
  concept: string;
  variant_num: number;
  png_filename: string;
  score_overall: number;
  score_virality: number;
  score_save_worthy: number;
  score_visual: number;
  score_system_thinking: number;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVariants = async () => {
      const { data } = await supabase
        .from('variants')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      setVariants(data || []);
      setLoading(false);
    };

    fetchVariants();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Group by concept
  const grouped = variants.reduce((acc, v) => {
    if (!acc[v.concept]) acc[v.concept] = [];
    acc[v.concept].push(v);
    return acc;
  }, {} as Record<string, Variant[]>);

  return (
    <div style={{ padding: '20px' }}>
      <h1>LinkedIn Content Variants</h1>

      {Object.entries(grouped).map(([concept, vars]) => (
        <div key={concept} style={{ marginBottom: '40px' }}>
          <h2>{concept}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {vars.map(v => (
              <VariantCard key={v.id} variant={v} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function VariantCard({ variant }: { variant: Variant }) {
  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '16px',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>Variant {variant.variant_num}</h3>

      {/* Preview thumbnail */}
      <img
        src={`/outputs/${variant.png_filename}`}
        alt={`Variant ${variant.variant_num}`}
        style={{ width: '100%', height: 'auto', marginBottom: '12px' }}
      />

      {/* Scores */}
      <div style={{ fontSize: '12px', marginBottom: '12px' }}>
        <p><strong>Overall:</strong> {variant.score_overall}/100</p>
        <p>Virality: {variant.score_virality} | Save: {variant.score_save_worthy}</p>
        <p>Visual: {variant.score_visual} | System: {variant.score_system_thinking}</p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => downloadPNG(variant.png_filename)}
          style={{ flex: 1, padding: '8px', background: '#111', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Download PNG
        </button>
        <button
          onClick={() => window.location.href = `/preview/${variant.id}`}
          style={{ flex: 1, padding: '8px', background: '#C84623', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Preview
        </button>
      </div>
    </div>
  );
}

function downloadPNG(filename: string) {
  const a = document.createElement('a');
  a.href = `/outputs/${filename}`;
  a.download = filename;
  a.click();
}
```

#### `/pages/preview/[id].tsx`

```typescript
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Preview() {
  const router = useRouter();
  const { id } = router.query;
  const [variant, setVariant] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchVariant = async () => {
      const { data } = await supabase
        .from('variants')
        .select('*')
        .eq('id', id)
        .single();

      setVariant(data);
    };

    fetchVariant();
  }, [id]);

  if (!variant) return <div>Loading...</div>;

  return (
    <div style={{ padding: '40px' }}>
      <h1>Variant {variant.variant_num}: {variant.concept}</h1>

      {/* Live HTML preview */}
      <iframe
        srcDoc={variant.html_artifact}
        style={{
          width: '1080px',
          height: '1350px',
          border: '1px solid #ccc',
          marginBottom: '20px'
        }}
      />

      {/* Metadata */}
      <div style={{ background: '#f0f0f0', padding: '16px', marginBottom: '20px' }}>
        <h3>Scores</h3>
        <p>Overall: {variant.score_overall}/100</p>
        <p>Virality: {variant.score_virality} | Save-Worthy: {variant.score_save_worthy}</p>
        <p>Visual: {variant.score_visual} | System Thinking: {variant.score_system_thinking}</p>
      </div>

      {/* Download button */}
      <button
        onClick={() => {
          const a = document.createElement('a');
          a.href = `/outputs/${variant.png_filename}`;
          a.download = variant.png_filename;
          a.click();
        }}
        style={{
          padding: '12px 24px',
          background: '#111',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '6px'
        }}
      >
        Download PNG
      </button>
    </div>
  );
}
```

### Vercel Config

`vercel.json`:

```json
{
  "version": 2,
  "public": false,
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 60,
      "memory": 1024
    }
  },
  "env": {
    "SUPABASE_URL": "@supabase_url",
    "SUPABASE_KEY": "@supabase_key",
    "NEXT_PUBLIC_SUPABASE_URL": "@next_public_supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@next_public_supabase_anon_key"
  }
}
```

---

## 3. Supabase Integration

### Database Tables

Create these tables in your Supabase project:

```sql
-- variants table
CREATE TABLE variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept TEXT NOT NULL,
  html_artifact TEXT,
  png_filename VARCHAR,
  variant_num INT,
  score_overall INT,
  score_virality INT,
  score_save_worthy INT,
  score_visual INT,
  score_system_thinking INT,
  design_direction VARCHAR,
  status VARCHAR DEFAULT 'generated',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES variants(id) ON DELETE CASCADE,
  post_copy TEXT,
  first_comment TEXT,
  linkedin_post_id VARCHAR,
  posted_at TIMESTAMP,
  reach INT,
  engagement INT,
  saves INT,
  created_at TIMESTAMP DEFAULT now()
);

-- exports table
CREATE TABLE exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES variants(id) ON DELETE CASCADE,
  format VARCHAR,
  file_path VARCHAR,
  file_size INT,
  exported_at TIMESTAMP DEFAULT now()
);

-- generation_jobs table (for tracking async jobs)
CREATE TABLE generation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept TEXT,
  num_variants INT,
  status VARCHAR DEFAULT 'queued',
  created_at TIMESTAMP DEFAULT now(),
  completed_at TIMESTAMP
);
```

### RLS Policies (optional)

```sql
-- Allow users to see their own variants
CREATE POLICY "Users can see variants" ON variants
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to insert variants
CREATE POLICY "Users can create variants" ON variants
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to see posts
CREATE POLICY "Users can see posts" ON posts
  FOR SELECT USING (auth.role() = 'authenticated');
```

---

## 4. Claude Code Integration

### How to Run from Chat

In Claude Code:

```python
import sys
import asyncio
sys.path.insert(0, '/home/claude/scripts')

from batch_generator import generate_and_save

# Generate batch
result = await generate_and_save(
    concept="Your concept here",
    num_variants=5,
    save_to_db=True
)

print(f"✓ Generated {result['total_variants']} variants")
print(f"Output: /mnt/user-data/outputs/")
```

### Environment Variables

Claude Code automatically loads from `os.environ`:

```python
import os

supabase_url = os.environ.get('SUPABASE_URL')
supabase_key = os.environ.get('SUPABASE_KEY')
```

These come from your `.env.local` file.

---

## 5. Complete Workflow

### Step-by-step

1. **In Claude Chat:**
   ```
   "Generate 5 variants: 'Claude vs ChatGPT vs Gemini for founders'"
   ```

2. **Claude Code runs:**
   - Generates 5 HTML artifacts
   - Exports to PNG @ 1080×1350 @ 144dpi
   - Scores each (360Brew)
   - Saves to Supabase
   - Returns: batch result

3. **Outputs:**
   - 5 PNGs in `/mnt/user-data/outputs/`
   - Database records in `variants` table
   - Scores visible in output

4. **On Vercel Dashboard:**
   - Click "Refresh" → fetches latest from Supabase
   - See all 5 variants with scores
   - Preview each one
   - Download PNG
   - Copy post copy + first comment

5. **Post on LinkedIn:**
   - Paste post copy
   - Paste first comment
   - Post
   - Get linkedin_post_id

6. **Track in Database:**
   - Update `posts` table with linkedin_post_id
   - Track reach, engagement, saves
   - Dashboard shows analytics

---

## 6. Automation (Optional)

### Scheduled Generation

Use GitHub Actions to generate variants on a schedule:

`.github/workflows/generate-variants.yml`:

```yaml
name: Generate LinkedIn Variants

on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday at 9 AM
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install -r scripts/requirements.txt
          playwright install chromium
      
      - name: Generate variants
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_KEY: ${{ secrets.SUPABASE_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          cd scripts
          python main.py --generate "Weekly founder digest"
      
      - name: Push outputs
        run: |
          git config user.name "Ultron Bot"
          git config user.email "bot@ultron.ai"
          git add outputs/
          git commit -m "Add weekly variants"
          git push
```

---

## Summary

| Component | Role | Tech Stack |
|-----------|------|-----------|
| **Claude Code** | Execution engine | Python (asyncio, Playwright, PIL) |
| **Vercel** | Web dashboard | React, TypeScript, Supabase SDK |
| **Supabase** | Database + auth | PostgreSQL, RLS policies |
| **Git** | Version control | GitHub |
| **Chat** | Interface | Claude.ai |

**Flow:**
```
Chat (concept)
  → Claude Code (Python pipeline)
  → /outputs/ (PNGs)
  → Supabase (metadata)
  → Vercel (preview/download)
  → LinkedIn (post)
  → Supabase (track reach)
```

**You're all set.** Start generating.

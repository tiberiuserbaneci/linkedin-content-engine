'use server'

import fs from 'fs/promises'
import path from 'path'

export async function deployMaterialToLive(draftId: string) {
  try {
    const materialsPath = path.join(process.cwd(), 'lib', 'materials.json')
    const content = await fs.readFile(materialsPath, 'utf-8')
    const data = JSON.parse(content)

    // Find the draft
    const draftIndex = data.drafts.findIndex((d: any) => d.id === draftId)
    if (draftIndex === -1) {
      throw new Error('Draft not found')
    }

    const draft = data.drafts[draftIndex]

    // Update draft status
    draft.status = 'ready'
    draft.date = new Date().toISOString().split('T')[0]

    // Move to materials (remove from drafts and add to materials)
    data.drafts.splice(draftIndex, 1)
    data.materials.push(draft)

    // Update metadata
    data.metadata.total_materials = data.materials.length
    data.metadata.last_updated = new Date().toISOString().split('T')[0]

    // Write back to file
    await fs.writeFile(materialsPath, JSON.stringify(data, null, 2), 'utf-8')

    return { success: true, message: `Material "${draft.title}" deployed to live!` }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, message: `Failed to deploy: ${message}` }
  }
}

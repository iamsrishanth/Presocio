/**
 * Puter Client for Storage and Key-Value Persistence
 * Integrates Puter.js for free, User-Pays model cloud storage
 */

export interface PuterDraft {
  id: string;
  data: any;
  updatedAt: string;
}

/**
 * Checks if Puter is available in the current environment
 */
export function isPuterAvailable(): boolean {
  return typeof window !== 'undefined' && 'puter' in window;
}

/**
 * Uploads a file (image or video) to Puter's cloud storage
 * Returns the public URL of the uploaded file
 */
export async function uploadMediaToPuter(file: File | Blob, filename: string): Promise<string> {
  if (!isPuterAvailable()) {
    throw new Error('Puter.js is not loaded or not available in this environment');
  }

  try {
    const puter = (window as any).puter;
    
    // Generate a unique filename to prevent collisions
    const uniqueFilename = `${Date.now()}_${filename}`;
    const filePath = `uploads/${uniqueFilename}`;
    
    // Ensure the uploads directory exists
    try {
      await puter.fs.mkdir('uploads');
    } catch (e) {
      // Ignore if directory already exists
    }
    
    // Write the file to Puter's filesystem under an 'uploads' directory
    await puter.fs.write(filePath, file);
    
    // Host the 'uploads' directory or file to get a public URL
    // Depending on Puter's exact API, this might create a hosting site
    const site = await puter.hosting.create('uploads', { index: false });
    
    // Construct the public URL
    const url = `https://${site.subdomain}.puter.site/${uniqueFilename}`;
    return url;
  } catch (error) {
    console.error('Puter Media Upload Error:', error);
    throw new Error('Failed to upload media to Puter storage');
  }
}

/**
 * Saves a post draft to Puter's Key-Value store
 */
export async function saveDraftToPuter(draftId: string, draftData: any): Promise<void> {
  if (!isPuterAvailable()) {
    console.warn('Puter.js not available. Draft will not be saved to cloud.');
    return;
  }

  try {
    const puter = (window as any).puter;
    const payload = {
      id: draftId,
      data: draftData,
      updatedAt: new Date().toISOString()
    };
    
    await puter.kv.set(`draft_${draftId}`, JSON.stringify(payload));
  } catch (error) {
    console.error('Puter Draft Save Error:', error);
    throw new Error('Failed to save draft to Puter KV store');
  }
}

/**
 * Retrieves a specific post draft from Puter's Key-Value store
 */
export async function getDraftFromPuter(draftId: string): Promise<PuterDraft | null> {
  if (!isPuterAvailable()) {
    return null;
  }

  try {
    const puter = (window as any).puter;
    const val = await puter.kv.get(`draft_${draftId}`);
    return val ? JSON.parse(val) : null;
  } catch (error) {
    console.error('Puter Draft Retrieve Error:', error);
    return null;
  }
}

/**
 * Deletes a draft from Puter's Key-Value store
 */
export async function deleteDraftFromPuter(draftId: string): Promise<void> {
  if (!isPuterAvailable()) {
    return;
  }

  try {
    const puter = (window as any).puter;
    await puter.kv.del(`draft_${draftId}`);
  } catch (error) {
    console.error('Puter Draft Delete Error:', error);
  }
}

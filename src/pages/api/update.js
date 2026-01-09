export const prerender = false;

export async function POST({ request }) {
  try {
    // Get environment variables
    const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;
    const REPO_OWNER = import.meta.env.REPO_OWNER;
    const REPO_NAME = import.meta.env.REPO_NAME;
    const BRANCH = import.meta.env.BRANCH || 'main';
    const PASSWORD_HASH = import.meta.env.PASSWORD_HASH || 'ee8c6c8f5e49c5e1e9b1ed7e5c3f7f0c8f9e3b5a7f2d4c1e9b8f7a6c5d3e2f1a0';

    // Validate environment variables
    if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
      return new Response(JSON.stringify({ 
        error: 'Missing environment variables. Check GITHUB_TOKEN, REPO_OWNER, and REPO_NAME.' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse incoming data
    const requestData = await request.json();
    
    // Check password hash
    if (requestData.passwordHash !== PASSWORD_HASH) {
      return new Response(JSON.stringify({ 
        error: 'Unauthorized: Invalid password' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Remove password hash from data before saving
    const { passwordHash, ...newData } = requestData;

    // GitHub API URLs
    const filePath = 'src/data/progress.json';
    const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;

    // Step 1: Get current file to retrieve SHA
    const getResponse = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': '1356-progress-tracker'
      }
    });

    if (!getResponse.ok) {
      const errorText = await getResponse.text();
      return new Response(JSON.stringify({ 
        error: `Failed to fetch current file: ${getResponse.status}`,
        details: errorText
      }), {
        status: getResponse.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const fileData = await getResponse.json();
    const sha = fileData.sha;

    // Step 2: Encode new content to Base64
    const content = JSON.stringify(newData, null, 2);
    const encodedContent = Buffer.from(content).toString('base64');

    // Step 3: Update file on GitHub
    const updateResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': '1356-progress-tracker'
      },
      body: JSON.stringify({
        message: `Update progress: ${new Date().toISOString()}`,
        content: encodedContent,
        sha: sha,
        branch: BRANCH
      })
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      return new Response(JSON.stringify({ 
        error: `Failed to update file: ${updateResponse.status}`,
        details: errorText
      }), {
        status: updateResponse.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await updateResponse.json();

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Progress updated successfully. Netlify will rebuild shortly.',
      commit: result.commit
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

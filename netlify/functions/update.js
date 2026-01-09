export const handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get environment variables
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO_OWNER = process.env.REPO_OWNER;
    const REPO_NAME = process.env.REPO_NAME;
    const BRANCH = process.env.BRANCH || 'main';
    const PASSWORD_HASH = process.env.PASSWORD_HASH || '6829fefe94561a77be3ceaa06999799c532424caaae91f76375966d286a7d501';

    // Validate environment variables
    if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Missing environment variables. Check GITHUB_TOKEN, REPO_OWNER, and REPO_NAME.' 
        })
      };
    }

    // Parse incoming data
    const requestData = JSON.parse(event.body);
    
    // Check password hash
    if (requestData.passwordHash !== PASSWORD_HASH) {
      return {
        statusCode: 401,
        body: JSON.stringify({ 
          error: 'Unauthorized: Invalid password' 
        })
      };
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
      return {
        statusCode: getResponse.status,
        body: JSON.stringify({ 
          error: `Failed to fetch current file: ${getResponse.status}`,
          details: errorText
        })
      };
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
      return {
        statusCode: updateResponse.status,
        body: JSON.stringify({ 
          error: `Failed to update file: ${updateResponse.status}`,
          details: errorText
        })
      };
    }

    const result = await updateResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        message: 'Progress updated successfully. Netlify will rebuild shortly.',
        commit: result.commit
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};

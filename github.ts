import { Octokit } from "@octokit/rest";

export async function fetchGithubUser(username: string) {
  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
    const response = await octokit.request('GET /users/{username}', {
      username,
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.status === 403) {
      console.error('Rate limit exceeded. Please wait or use authentication');
    }
    throw error;
  }
}

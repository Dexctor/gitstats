import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { getToken } from 'next-auth/jwt';
import { headers } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    
    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    const octokit = new Octokit({
      auth: token,
      headers: {
        accept: 'application/vnd.github.v3+json',
      },
    });

    const [user, repos] = await Promise.all([
      octokit.users.getByUsername({
        username: params.username,
      }),
      octokit.repos.listForUser({
        username: params.username,
        per_page: 100,
      }),
    ]);

    const stats = {
      totalStars: repos.data.reduce((acc, repo) => acc + (repo.stargazers_count ?? 0), 0),
      totalForks: repos.data.reduce((acc, repo) => acc + (repo.forks_count ?? 0), 0),
      totalWatchers: repos.data.reduce((acc, repo) => acc + (repo.watchers_count ?? 0), 0),
      repoCount: repos.data.length,
      topLanguages: calculateTopLanguages(repos.data),
      totalCommits: 0, // You'll need to implement this
      totalPRs: 0, // You'll need to implement this
      totalIssues: 0, // You'll need to implement this
    };

    return NextResponse.json({
      user: user.data,
      stats,
      repos: repos.data,
    });
    
  } catch (error: any) {
    console.error('GitHub API Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch GitHub data',
        details: error.response?.data?.message
      },
      { status: error.status || 500 }
    );
  }
}

function calculateTopLanguages(repos: any[]): { name: string; count: number }[] {
  const languages = repos.reduce((acc: Record<string, number>, repo: { language: string | null }) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});

  return Object.entries(languages)
    .map(([name, count]) => ({ name, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}
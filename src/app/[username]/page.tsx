import { searchGithubUser } from '@/lib/github';
import { notFound } from 'next/navigation';

export default async function UserPage({ params }: { params: { username: string } }) {
  try {
    const userData = await searchGithubUser(params.username);
    
    if (!userData) {
      return notFound();
    }

    return (
      <div>
        {/* Votre UI ici */}
      </div>
    );
  } catch (error) {
    console.error('Error:', error);
    return notFound();
  }
} 
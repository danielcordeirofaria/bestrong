import { auth } from '@/auth';
import { sql } from '@vercel/postgres';
import ProfileForm from '@/components/ui/profile-form';

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const user = await sql`SELECT bio FROM users WHERE id = ${session.user.id}`;
    const bio = user.rows[0]?.bio || '';

    return (
        <div className="w-full">
            <ProfileForm initialBio={bio} />
        </div>
    );
}

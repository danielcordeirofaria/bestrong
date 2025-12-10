import { auth } from '@/auth';
import { sql } from '@vercel/postgres';
import ProfileForm from '@/components/ui/profile-form';

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const user = await sql`SELECT bio, profile_image FROM users WHERE id = ${session.user.id}`;
    const bio = user.rows[0]?.bio || '';
    const profileImage = user.rows[0]?.profile_image || null;

    return (
        <div className="w-full">
            <ProfileForm initialBio={bio} initialImage={profileImage} />
        </div>
    );
}

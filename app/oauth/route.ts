'use client'

import { Client, Account, ID } from 'appwrite';
import { createAdminClient } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';

const {
    APPWRITE_DATABASE_ID: DATABASE_ID,
    APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
} = process.env;

export async function GET() {
    const router = useRouter();
    const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT as string)

    const account = new Account(client);
    const session = await account.getSession('current');
    console.log(session);

    const user = await account.get();
    console.log(user);

    const { database } = await createAdminClient();
    await database.createDocument(
        DATABASE_ID,
        USER_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          name: user.name,
          email: user.email
        }
    );
    router.push('/dashboard');
}

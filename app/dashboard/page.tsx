'use client'

import { useEffect, useRef, useState } from 'react'
import { Client, Account, ID, Databases, Query } from 'appwrite'
import Dashboard from '@/components/Dashboard'
import Transition from '@/components/Transition'
import React from 'react'
import { useRouter } from 'next/navigation'

const DashboardPage = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  // const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(false);
  const router = useRouter();
  useEffect(() => {
    const getUserDetails = async () => {
      if (!isMounted.current) {
        isMounted.current = true;
        return;
      }
      try {
        const client = new Client();
        client
          .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
          .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);
        const account = new Account(client);
        const user = await account.get();
        if (!user) throw new Error('User not found')
        const database = new Databases(client);
        const allDocuments = await database.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID!
        );
        console.log("All documents:", allDocuments);
        
        const existingUser = await database.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID!,
          [Query.equal('userId', [user.$id])]
        )
        console.log('Existing user:',existingUser);
        if(!existingUser.documents.length) {
          const response = await database.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID!,
            ID.unique(),
            {
              userId: user.$id,
              name: user.name,
              email: user.email,
            }
          )
          if (!response) {
            throw new Error('Error adding user to database');
          }
        }
        setUserEmail(user.email);
        setUserName(user.name);
        setUserId(user.$id);
        // setIsLoading(false);
      }
      catch (error) {
        console.error(error);
        router.push('/error')
      }

    }
    getUserDetails();
  }, [router])

  return (
    <div>
      {
        // isLoading?
        // (<Transition />) :
        <Dashboard name={userName} email={userEmail} id={userId}/> 
      }
    </div>
  )
}

export default DashboardPage;
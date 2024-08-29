'use server'

import { createAdminClient } from "../appwrite";
import { ID, Query } from "node-appwrite";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { OAuthProvider } from "node-appwrite";
import { stringify } from "querystring";

let sessionSecret = null;

export async function isAuthenticated() {
  const cookieStore = cookies();
  const token = cookieStore.get("my-custom-session");

  if (token && token.value === sessionSecret) {
    return true;
  }

  return false;
}

// export const getUserInfo = async (userId: string) => {
//   try {
//     const { database } = await createAdminClient();
//     const user = await database.listDocuments(
//       DATABASE_ID!,
//       USER_COLLECTION_ID!,
//       [Query.equal('userId', [userId])]
//     )

//     return {
//       name: user.documents[0].name,
//       email: user.documents[0].email,
//     }
//   } catch (error) {
//     console.log(error)
//   }
// }

export async function signUpWithEmail({ email, password, name }) {
  let newUserAccount = null;
  try {
    if (!name || !password || !email) {
      throw new Error('Input field empty');
    }
    const { account, database } = await createAdminClient();
    newUserAccount = await account.create(ID.unique(), email, password, name);
    if (!newUserAccount) throw new Error('Error creating user');
    const session = await account.createEmailPasswordSession(email, password);

    sessionSecret = session.secret;

    cookies().set("my-custom-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    })
    // await database.createDocument(
    //   DATABASE_ID,
    //   USER_COLLECTION_ID,
    //   ID.unique(),
    //   {
    //     userId: newUserAccount.$id,
    //     name: name,
    //     email: email,
    //   }
    // )
  } catch (error) {
    console.error(error);
  }
  redirect(`/dashboard`);
}

// export async function signUpWithGithub() {
//   const { account, user } = await createAdminClient();
//   const origin = headers().get("origin");

//   const redirectUrl = await account.createOAuth2Token(
//     OAuthProvider.Github,
//     `${origin}/oauth`,
//     `${origin}/signup`,
//     ['user']
//   );
//   // const user = await account.get();
//   // const userEmail = user.email;
//   // const session = await account.createEmailPasswordSession(userEmail, 'github');

//   // sessionSecret = session.secret;

//   // cookies().set("my-custom-session", session.secret, {
//   //   path: '/',
//   //   httpOnly: true,
//   //   sameSite: 'strict',
//   //   secure: true,
//   // })
//   return redirect(redirectUrl);
// }


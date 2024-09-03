'use client'

import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import NewProjectDiv from './NewProjectDiv';
import ProjectDetails from './ProjectDetails';
import { Client, Account, Databases, ID, Query } from 'appwrite';

interface MainGridProps {
  id: string;
  name: string;
  active: string;
  projectDetails: string;
  toggleProjectDetails: (projectId: string) => void;
}

const MainGrid: React.FC<MainGridProps> = ({ id, name, active, projectDetails, toggleProjectDetails }) => {
  const [userProjects, setUserProjects] = useState([{}])
  const [projectName, setProjectName] = useState('');
  const [projectInviteCode, setProjectInviteCode] = useState('');
  const isMounted = useRef(false);
  useEffect(() => {
    const getProjects = async () => {
      if (!isMounted.current) {
        isMounted.current = true;
        return;
      }
      try {
        const client = new Client();
        client
          .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
          .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);
        const database = new Databases(client);
        const project = await database.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_PROJECT_COLLECTION_ID!,
          [Query.or([Query.contains('userId',[id]),Query.equal('projectId',[id])])]
        )
        setUserProjects(project.documents);
        console.log("Projects:" ,userProjects);
      }
      catch (error) {
        console.error(error);
      }
    }
    getProjects();
  },[])
  const handleCreateProject = async (e: FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const year = now.getFullYear(); 
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0'); 
    const formattedDate = `${day}-${month}-${year}`;
    try {
      const client = new Client();
      client
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);
      const database = new Databases(client);
      const project = await database.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PROJECT_COLLECTION_ID!,
        ID.unique(),
        {
          name: projectName,
          date: formattedDate,
          userId: [],
          projectId: id,
        }
      )
      setUserProjects((prev) => (
        [...prev, project.documents]
      ))
    } catch (error) {
      console.error(error);
    }
  }
  const handleInviteCode = (e: FormEvent) => {
    e.preventDefault();
  }
  return (
    <>
      {
        active === 'home' ? (projectDetails.length > 0 ? (<ProjectDetails projectId={projectDetails} />) : (
          <div className='lg:ml-[260px] py-4 px-[0.8vw]'>
            <div className='pb-8 pt-4 border-b-2'>
              <h1 className='text-[3rem]'>Welcome {name.split(" ")[0]},</h1>
            </div>
            <div className='lg:grid grid-cols-3 grid-rows-2 gap-4 mt-4'>
              <div className='col-span-2 row-span-2 bg-[#030711] p-4 rounded-lg border-[1px] border-gray-800'>
                <h2 className='text-[24px] font-[600]'>My Projects</h2>
                <span className="text-xs text-muted-foreground">
                  Joined December 2021
                </span>
                <div className='mt-8'>
                  {userProjects.length ? (
                    <div>
                      <NewProjectDiv id='1' toggleProjectDetails={toggleProjectDetails} />
                      <NewProjectDiv id='2' toggleProjectDetails={toggleProjectDetails} />
                      <NewProjectDiv id='3' toggleProjectDetails={toggleProjectDetails} />
                    </div>
                  ) : (
                    <div className='flex items-center justify-center'>
                      <div>
                        <h1 className='text-[3.7vw] text-gray-800'>
                          No projects yet.
                        </h1>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className='xxs:mt-4 lg:m-0'>
                <Card>
                  <CardHeader>
                    <CardTitle>Create project</CardTitle>
                    <CardDescription>Create your own work board.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleCreateProject}>
                    <CardContent>
                      <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" placeholder="Name of your project" onChange={(e) => setProjectName(e.target.value)} />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button type='submit'>Create</Button>
                    </CardFooter>
                  </form>
                </Card>
              </div>
              <div className='xxs:mt-4 lg:m-0'>
                <Card>
                  <CardHeader>
                    <CardTitle>Invite code</CardTitle>
                    <CardDescription>Join an existing project by entering your invite code.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleInviteCode}>
                    <CardContent>
                      <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="inviteCode">Invite code</Label>
                          <Input id="inviteCode" placeholder="Enter invite code here" onChange={(e) => setProjectInviteCode(e.target.value)} />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button type='submit'>Join</Button>
                    </CardFooter>
                  </form>
                </Card>
              </div>
            </div>
          </div>
        )) : (
          active === 'projects' ? (projectDetails.length > 0 ? (<ProjectDetails projectId={projectDetails} />) : (
            <div className='lg:ml-[260px] py-4 px-[0.8vw]'>
              <div className='col-span-2 row-span-2 bg-[#030711] p-4 rounded-lg border-[1px] border-gray-800'>
                <h2 className='text-[32px] font-[600]'>My Projects</h2>
                <span className="text-xs text-muted-foreground">
                  Joined December 2021
                </span>
                <div className='mt-8'>
                  {userProjects.length ? (
                    <div>
                      <NewProjectDiv id='1' toggleProjectDetails={toggleProjectDetails} />
                      <NewProjectDiv id='2' toggleProjectDetails={toggleProjectDetails} />
                      <NewProjectDiv id='3' toggleProjectDetails={toggleProjectDetails} />
                    </div>
                  ) : (
                    <div className='flex items-center justify-center'>
                      <div>
                        <h1 className='text-[3.7vw] text-gray-800'>
                          No projects yet.
                        </h1>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className='lg:ml-[260px] py-4 px-[0.8vw]'>Settings is active</div>
          )
        )
      }
    </>
  );
};

export default MainGrid;

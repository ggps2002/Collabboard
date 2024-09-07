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
import { Skeleton } from "@/components/ui/skeleton"
import NewProjectDiv from './NewProjectDiv';
import ProjectDetails from './ProjectDetails';
import { Client, Databases, ID, Query } from 'appwrite';

interface MainGridProps {
  id: string;
  name: string;
  active: string;
  projectDetails: string;
  toggleProjectDetails: (projectId: string) => void;
}

const MainGrid: React.FC<MainGridProps> = ({ id, name, active, projectDetails, toggleProjectDetails }) => {
  const [userProjects, setUserProjects] = useState<any[]>([])
  const [projectName, setProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
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
          [Query.or([Query.contains('userId', [id]), Query.equal('projectId', [id])])]
        )
        setUserProjects((prev) => (
          [...prev, ...project.documents]
        ))
        setIsLoading(false);
      }
      catch (error) {
        console.error(error);
      }
    }
    getProjects();
  }, [])
  const handleCreateProject = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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
        [...prev, project]
      ))
      setProjectName('');
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }
  const handleProjectDelete = (name: string) => {
    setUserProjects(
      userProjects.filter(project => project.name != name)
    )
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
            <div className='lg:grid grid-cols-3 grid-rows-1 gap-4 mt-4'>
              <div className='col-span-2 row-span-2 bg-[#030711] p-4 rounded-lg border-[1px] border-gray-800'>
                <h2 className='text-[24px] font-[600]'>My Projects</h2>
                <span className="text-xs text-muted-foreground">
                  Joined December 2021
                </span>
                <div className='mt-8'>
                  {
                    isLoading ? (
                      <div>
                      <div className="flex items-center space-x-4 mt-9">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-9">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-9">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-9">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-9">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                      </div>
                    )
                      : (userProjects.length ? (
                        <div>
                          {
                            userProjects.map((project, index) => (
                              <NewProjectDiv key={index} id={project.projectId} users={project.userId} name={project.name} deleteProject={handleProjectDelete} toggleProjectDetails={toggleProjectDetails} />
                            ))
                          }
                        </div>
                      ) : (
                        <div className='flex items-center justify-center'>
                          <div>
                            <h1 className='text-[3.7vw] text-gray-800'>
                              No projects yet.
                            </h1>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
              <div>
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
                            <Input id="name" placeholder="Name of your project" onChange={(e) => setProjectName(e.target.value)} value={projectName} />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button type='submit'>Create</Button>
                      </CardFooter>
                    </form>
                  </Card>
                </div>
                <div className='mt-4'>
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
                      {
                        userProjects.map((project, index) => (
                          <NewProjectDiv key={index} id={project.projectId} users={project.userId} name={project.name} deleteProject={handleProjectDelete} toggleProjectDetails={toggleProjectDetails} />
                        ))
                      }
                    </div>
                  ) : (
                    <div className='flex items-start justify-center h-screen'>
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

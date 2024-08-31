import React from 'react';
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

interface MainGridProps {
  name: string;
}

const MainGrid: React.FC<MainGridProps> = ({ name }) => {
  const handleCreateProject = () => {

  }
  const handleInviteCode = () => {
    
  }
  return (
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
            <NewProjectDiv />
            <NewProjectDiv />
            <NewProjectDiv />
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
                    <Input id="name" placeholder="Name of your project" />
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
                    <Input id="inviteCode" placeholder="Enter invite code here" />
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
  );
};

export default MainGrid;

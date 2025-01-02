'use client'

import React from 'react'
import { Client, Databases, Query } from 'appwrite'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
// import { useToast } from "@/components/ui/use-toast";
// import { Toaster } from "@/components/ui/toaster"
import { Toaster, toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Copy } from "lucide-react"
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';

interface NewProjectProps {
  id: string;
  name: string;
  users: [];
  toggleProjectDetails: (projectId: string) => void;
  deleteProject: (name: string) => void;
}

const NewProjectDiv: React.FC<NewProjectProps> = ({ id, name, users, toggleProjectDetails, deleteProject }) => {
  const router = useRouter();
  const handleViewClick = async() => {
    try {
      const client = new Client();
      client
          .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
          .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);
      const database = new Databases(client);
      const response = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PROJECT_COLLECTION_ID!,
        [Query.equal('name',[name])]
      )
      if (response.documents.length > 0) {
        const documentId = response.documents[0].$id;
        window.open('/canvas/' + documentId, '_blank');
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleProjectDelete = async() => {
    try {
      const client = new Client();
      client
          .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
          .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);
      const database = new Databases(client);
      const response = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PROJECT_COLLECTION_ID!,
        [Query.equal('name',[name])]
      )
      deleteProject(name);
      if(response.documents.length > 0) {
        const documentId = response.documents[0].$id;
        await database.deleteDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_PROJECT_COLLECTION_ID!,
          documentId
        )
      }
    } catch (error) {
      console.error(error);
    }
  }
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Text copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  }

  return (
    <div className='min-h-[7vw] border-t-2 border-b-1 p-[2vw] '>
      <div className='flex justify-between'>
        <h3>
          <div><TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Toaster expand={true} richColors theme='dark' />
                <ContentCopyIcon fontSize='small' className='cursor-pointer' onClick={() => {
                  handleCopyText("Copy this")
                  toast.success('Code copied!');
                }} />
              </TooltipTrigger> {name}
              <TooltipContent className='text-xs text-muted-foreground p-1'>
                Copy invite code
              </TooltipContent>
            </Tooltip>
          </TooltipProvider></div>
        </h3>
        <p className='hidden lg:block text-[0.8rem] text-xs text-muted-foreground'>a day ago</p>
        <div>
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger><MoreHorizIcon /></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => toggleProjectDetails(name)}>
                  Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <DialogTrigger>Invite link</DialogTrigger>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share link</DialogTitle>
                <DialogDescription>
                  Anyone who has this link will be able to access this project.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">
                    Link
                  </Label>
                  <Input
                    id="link"
                    defaultValue="https://ui.shadcn.com/docs/installation"
                    readOnly
                  />
                </div>
                <Button onClick={() => {
                  handleCopyText('https://ui.shadcn.com/docs/installation');
                }} size="sm" className="px-3">
                  <span className="sr-only">Copy</span>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className='mt-5 flex justify-between'>
        <div className='flex'>
          <div className='lg:flex gap-1 hidden'>
            {
              Array.from({ length: Math.min(users.length + 1, 2) }).map((_, index) => (
                <Avatar key={index} className='h-[1.2rem] w-[1.2rem]'>
              <AvatarImage key={index} src="data:image/jpeg;base64,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" />
              <AvatarFallback key={index}>CN</AvatarFallback>
            </Avatar> 
              ))
            }
            <div className='flex'><p className={`text-[0.8rem] cursor-pointer ${users.length - 1 < 0 && "hidden"}`}>+<span className="hover:underline" onClick={() => toggleProjectDetails(id)}>{users.length - 1} more</span></p></div>
          </div>
        </div>
        <div className='flex'>
          <Button className='mr-4' onClick={handleViewClick}>View</Button>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="destructive" >Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your project
                  and remove project data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleProjectDelete} className='bg-red-500'>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}

export default NewProjectDiv
import React from 'react'
import { Button } from '../ui/button'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Label } from '../ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import NewProjectDiv from './NewProjectDiv';


const MainGrid = () => {
    return (
        <div className='lg:ml-[17vw] py-4 px-[0.8vw]'>
            <div className='py-8'>
                <h1 className='text-[3rem]'>Welcome John,</h1>
            </div>
            <div className='grid lg:grid-cols-3 xs:grid-cols-1 grid-rows-2 gap-4'>
                <div className='col-span-2 row-span-2'>
                    <h2>My Projects</h2>
                    <div className='mt-4'>
                        <NewProjectDiv />
                        <NewProjectDiv />
                        <NewProjectDiv />
                    </div>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Create project</CardTitle>
                            <CardDescription>Create your own work board</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" placeholder="Name of your project" />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter>
                            <p>Card Footer</p>
                        </CardFooter>
                    </Card>

                </div>
            </div>
        </div>
    )
}

export default MainGrid
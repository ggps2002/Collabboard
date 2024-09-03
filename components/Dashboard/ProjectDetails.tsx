import React from 'react'
import UserDiv from './UserDiv';

interface ProjectDetailsProps {
    projectId : string;
}

const ProjectDetails : React.FC<ProjectDetailsProps> = ({projectId}) => {
  return (
    <div className='lg:ml-[260px] py-4 px-[0.8vw]'>
        <div className='lg:grid grid-cols-3 grid-rows-1 gap-4 '>
            <div className='col-span-2 bg-[#030711] p-4 rounded-lg border-[1px] border-gray-800 mb-2'>
                <div className=''>
                    <h1 className='text-[2.7rem]'>
                        Project Name {projectId}.
                    </h1>
                    <h2 className='text-lg text-muted-foreground'>
                        Created on : 22nd December 2021
                    </h2>
                    <h2 className='text-lg text-muted-foreground'>
                        Created by : User
                    </h2>
                    <h2 className='text-lg text-muted-foreground'>
                        47 users
                    </h2>
                </div>
            </div>
            <div className='bg-[#030711] p-4 rounded-lg border-[1px] border-gray-800'>
                <div className='border-b-2 pb-2'>
                    People:
                </div>
                <div>
                    <UserDiv />
                    <UserDiv/>
                    <UserDiv/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProjectDetails
import React from 'react'

interface ProjectDetailsProps {
    projectId : string;
}

const ProjectDetails : React.FC<ProjectDetailsProps> = ({projectId}) => {
  return (
    <div className='lg:ml-[260px] py-4 px-[0.8vw]'>
        <div className='lg:grid grid-cols-3 grid-rows-1 gap-4 mt-4'>
            <div className='col-span-2 bg-[#030711] p-4 rounded-lg border-[1px] border-gray-800'>
                Project Details of project {projectId}.
            </div>
            <div className='bg-[#030711] p-4 rounded-lg border-[1px] border-gray-800'>
                Peoples:
            </div>
        </div>
    </div>
  )
}

export default ProjectDetails
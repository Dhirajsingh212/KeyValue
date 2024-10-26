import HomePageCreateMenu from '@/components/HomePageCreateMenu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProjectDetails } from '@/types/types'
import { Key, Search, User } from 'lucide-react'
import { FaTrash } from 'react-icons/fa'

const SecretComp = ({ projectDetails }: { projectDetails: ProjectDetails }) => {
  return (
    <>
      <div className='flex flex-col gap-2 md:flex-row md:justify-between'>
        <p className='text-xl font-semibold'>{`Active(${projectDetails ? projectDetails.envs.length : 0})`}</p>
        <div className='flex flex-row justify-end gap-4'>
          <HomePageCreateMenu />
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              placeholder='Search for secret'
              className='border-2 bg-card pl-10 pr-4 dark:border-input dark:bg-neutral-900'
            />
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        {projectDetails &&
          projectDetails.envs &&
          projectDetails.envs.length === 0 && <p>No envs found.</p>}
        {projectDetails &&
          projectDetails.envs &&
          projectDetails.envs.map((pairs, index) => {
            return (
              <div
                key={index}
                className='flex flex-col items-center gap-2 py-2 md:flex-row'
              >
                <div className='relative w-full'>
                  <User className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
                  <Input
                    disabled
                    placeholder='Name'
                    value={pairs.name}
                    className='w-full border-2 bg-card pl-10 pr-4 dark:border-input dark:bg-neutral-900'
                  />
                </div>
                <div className='relative w-full'>
                  <Key className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
                  <Input
                    disabled
                    placeholder='API KEY'
                    value={pairs.value}
                    className='w-full border-2 bg-card pl-10 pr-4 dark:border-input dark:bg-neutral-900'
                  />
                </div>
                <Button
                  variant='destructive'
                  className='mt-2 w-full md:mt-0 md:w-10'
                >
                  <FaTrash />
                </Button>
              </div>
            )
          })}
      </div>
    </>
  )
}

export default SecretComp

'use client'

import { extractZip } from '@/actions/convertZip'
import { Button } from '@/components/ui/button'
import { showToast } from '@/toast'
import { GithubFile } from '@/types/types'
import { useAuth } from '@clerk/nextjs'
import { saveAs } from 'file-saver'
import { AnimatePresence } from 'framer-motion'
import { ArrowDownToLine } from 'lucide-react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import GithubFilesCard from './GithubFilesCard'
import MultiStepDialog from './MultiStepDialog'

export default function GithubCreateFile({
  githubFiles = []
}: {
  githubFiles?: GithubFile[]
}) {
  const { theme } = useTheme()
  const { userId } = useAuth()
  const path = usePathname()

  const downloadZip = async () => {
    try {
      if (!userId) {
        showToast('error', 'User not logged in', theme)
        return
      }

      const response = await extractZip(userId, path.split('/')[2])

      if (!response) {
        throw new Error('Failed to download zip file')
      }

      const blob = new Blob([new Uint8Array(response)], {
        type: 'application/zip'
      })

      saveAs(blob, 'files.zip')
    } catch (error) {
      console.error('Error downloading zip:', error)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Config Files</h2>
        <div className='flex flex-row gap-2'>
          <MultiStepDialog />
          <Button onClick={downloadZip}>
            <ArrowDownToLine className='mr-2 size-4' />
            Download
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {githubFiles.map((item: GithubFile, index: number) => (
          <GithubFilesCard item={item} index={index} />
        ))}
      </AnimatePresence>
    </div>
  )
}

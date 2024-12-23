'use client'

import { FC } from 'react';

interface EditorOutputProps {
  content: any
}

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <div className='whitespace-pre-wrap'>
      {content}
    </div>
  )
}

export default EditorOutput;
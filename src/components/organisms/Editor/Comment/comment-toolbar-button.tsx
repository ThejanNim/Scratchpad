'use client';

import * as React from 'react';

import { MessageSquareTextIcon } from 'lucide-react';
import { useEditorRef } from 'platejs/react';

import { commentPlugin } from '@/components/organisms/Editor/Comment/comment-kit';

import { ToolbarButton } from '../../../ui/toolbar';

export function CommentToolbarButton() {
  const editor = useEditorRef();

  return (
    <ToolbarButton
      onClick={() => {
        editor.getTransforms(commentPlugin).comment.setDraft();
      }}
      data-plate-prevent-overlay
      tooltip="Comment"
    >
      <MessageSquareTextIcon />
    </ToolbarButton>
  );
}

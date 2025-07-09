'use client';

import * as React from 'react';

import { AIChatPlugin } from '@platejs/ai/react';
import { useEditorPlugin, useEditorRef } from 'platejs/react';
import { ToolbarButton } from '@/components/ui/toolbar';

export function AIToolbarButton(
  props: React.ComponentProps<typeof ToolbarButton>
) {
  const { api } = useEditorPlugin(AIChatPlugin);
  const editor = useEditorRef();
  return (
    <ToolbarButton
      {...props}
      onClick={() => {
        api.aiChat.show();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    />
  );
}

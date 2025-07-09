'use client';

import { createPlatePlugin } from 'platejs/react';

import { FloatingToolbar } from '@/components/organisms/Editor/Toolbar/FloatingToolbar/floating-toolbar';
import { FloatingToolbarButtons } from '@/components/organisms/Editor/Toolbar/FloatingToolbar/floating-toolbar-buttons';

export const FloatingToolbarKit = [
  createPlatePlugin({
    key: 'floating-toolbar',
    render: {
      afterEditable: () => (
        <FloatingToolbar>
          <FloatingToolbarButtons />
        </FloatingToolbar>
      ),
    },
  }),
];

'use client';

import { createPlatePlugin } from 'platejs/react';

import { FixedToolbarButtons } from '@/components/organisms/Editor/Toolbar/FixedToolbar/fixed-toolbar-buttons';
import { FixedToolbar } from './fixed-toolbar';

export const FixedToolbarKit = [
  createPlatePlugin({
    key: 'fixed-toolbar',
    render: {
      beforeEditable: () => (
        <FixedToolbar>
          <FixedToolbarButtons />
        </FixedToolbar>
      ),
    },
  }),
];

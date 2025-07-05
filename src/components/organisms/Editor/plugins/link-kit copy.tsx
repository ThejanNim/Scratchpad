'use client';

import { LinkPlugin } from '@platejs/link/react';

import { LinkElement } from '@/components/organisms/Editor/elements/link-node';
import { LinkFloatingToolbar } from '@/components/organisms/Editor/elements/link-toolbar';

export const LinkKit = [
  LinkPlugin.configure({
    render: {
      node: LinkElement,
      afterEditable: () => <LinkFloatingToolbar />,
    },
  }),
];

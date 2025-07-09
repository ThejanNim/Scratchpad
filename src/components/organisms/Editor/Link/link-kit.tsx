'use client';

import { LinkPlugin } from '@platejs/link/react';

import { LinkElement } from '@/components/organisms/Editor/Link/link-node';
import { LinkFloatingToolbar } from '@/components/organisms/Editor/Link/link-toolbar';

export const LinkKit = [
  LinkPlugin.configure({
    render: {
      node: LinkElement,
      afterEditable: () => <LinkFloatingToolbar />,
    },
  }),
];

'use client';

import { ListPlugin } from '@platejs/list/react';
import { KEYS } from 'platejs';

import { IndentKit } from '@/components/organisms/Editor/BasicStyles/Indent/indent-kit';
import { BlockList } from '@/components/organisms/Editor/List/block-list';

export const ListKit = [
  ...IndentKit,
  ListPlugin.configure({
    inject: {
      targetPlugins: [
        ...KEYS.heading,
        KEYS.p,
        KEYS.blockquote,
        KEYS.codeBlock,
        KEYS.toggle,
      ],
    },
    render: {
      belowNodes: BlockList,
    },
  }),
];

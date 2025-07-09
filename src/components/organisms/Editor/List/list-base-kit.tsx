import { BaseListPlugin } from '@platejs/list';
import { KEYS } from 'platejs';

import { BaseIndentKit } from '@/components/organisms/Editor/BasicStyles/Indent/indent-base-kit';
import { BlockListStatic } from '@/components/organisms/Editor/List/block-list-static';

export const BaseListKit = [
  ...BaseIndentKit,
  BaseListPlugin.configure({
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
      belowNodes: BlockListStatic,
    },
  }),
];

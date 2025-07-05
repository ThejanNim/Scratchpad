import {
  BaseBlockquotePlugin,
  BaseH1Plugin,
  BaseH2Plugin,
  BaseH3Plugin,
  BaseHorizontalRulePlugin,
} from '@platejs/basic-nodes';
import { BaseParagraphPlugin } from 'platejs';

import { BlockquoteElementStatic } from '@/components/organisms/Editor/elements/blockquote-node-static';
import {
  H1ElementStatic,
  H2ElementStatic,
  H3ElementStatic,
} from '@/components/organisms/Editor/elements/heading-node-static';
import { HrElementStatic } from '@/components/organisms/Editor/elements/hr-node-static';
import { ParagraphElementStatic } from '@/components/organisms/Editor/elements/paragraph-node-static';

export const BaseBasicBlocksKit = [
  BaseParagraphPlugin.withComponent(ParagraphElementStatic),
  BaseH1Plugin.withComponent(H1ElementStatic),
  BaseH2Plugin.withComponent(H2ElementStatic),
  BaseH3Plugin.withComponent(H3ElementStatic),
  BaseBlockquotePlugin.withComponent(BlockquoteElementStatic),
  BaseHorizontalRulePlugin.withComponent(HrElementStatic),
];

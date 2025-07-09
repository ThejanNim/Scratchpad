import { BaseColumnItemPlugin, BaseColumnPlugin } from '@platejs/layout';

import {
  ColumnElementStatic,
  ColumnGroupElementStatic,
} from '@/components/organisms/Editor/Layout/column-node-static';

export const BaseColumnKit = [
  BaseColumnPlugin.withComponent(ColumnGroupElementStatic),
  BaseColumnItemPlugin.withComponent(ColumnElementStatic),
];

'use client';

import { BasicBlocksKit } from './basic-blocks-kit';
import { BasicMarksKit } from '../BasicMarks/basic-marks-kit';

export const BasicNodesKit = [...BasicBlocksKit, ...BasicMarksKit];

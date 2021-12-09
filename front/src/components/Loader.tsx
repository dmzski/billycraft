import React from 'react';
import { Loader as CocoLoader } from '@coco-ui/core';
import { LoaderProps } from '@coco-ui/core/dist/components/Loader';

const Loader = ({ size }: LoaderProps): JSX.Element => <CocoLoader size={size} />

export default Loader;

import React from 'react';
declare const injectClassNames: (as?: string) => (strings: TemplateStringsArray) => {
    ({ className, children, ...props }: any): React.DOMElement<any, Element>;
    displayName: string;
};
export default injectClassNames;

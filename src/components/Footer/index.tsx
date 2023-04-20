import * as React from 'react';
import { Layout } from 'antd';

const Footer: React.FC = () => {
    return (
        <Layout.Footer className={'footer'} style={{ textAlign: 'center' }}>
            Asp.Net Boilerplate - React © 2018{' '}
            <a href="https://github.com/ryoldash/module-zero-core-template">Github Page</a>
        </Layout.Footer>
    );
};

export default Footer;

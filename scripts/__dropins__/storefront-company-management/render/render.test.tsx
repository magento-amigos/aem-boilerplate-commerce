/********************************************************************
 * ADOBE CONFIDENTIAL
 * __________________
 *
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 *******************************************************************/

// @ts-nocheck
import { render } from './render';

describe('render', () => {
  test('should render', async () => {
    const root = document.createElement('div');
    root.setAttribute('id', 'root');

    const Container = () => <div>container</div>;

    await render.render(Container, {})(root);

    expect(root.innerHTML).toBe('<undefined definition="[object Object]"><div>container</div></undefined>');
  });
});

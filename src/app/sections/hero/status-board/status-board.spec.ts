import { TestBed } from '@angular/core/testing';
import { StatusBoard } from './status-board';

describe('StatusBoard', () => {
  async function render(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(StatusBoard);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  it('lists every product with its category and status, linking to its section', async () => {
    const rows = [...(await render()).querySelectorAll('a.board-row')].map((row) => ({
      name: row.querySelector('.board-name')?.textContent,
      category: row.querySelector('.board-category')?.textContent,
      status: row.querySelector('ui-status-chip')?.textContent,
      href: row.getAttribute('href'),
    }));

    expect(rows).toEqual([
      {
        name: 'Prumo',
        category: 'Electoral transparency',
        status: 'In development',
        href: '#prumo',
      },
      {
        name: 'Agora',
        category: 'Federated chat, voice, and video',
        status: 'Live',
        href: '#products',
      },
      { name: 'Cenaculum', category: 'Screen-sharing rooms', status: 'Live', href: '#products' },
    ]);
  });

  it('reads each row as separate words and counts the products by status', async () => {
    const board = await render();

    expect(board.querySelector('a.board-row')?.textContent).toBe(
      'Prumo Electoral transparency In development',
    );
    expect(board.querySelector('.board-summary')?.textContent).toBe('2 live, 1 in development');
  });
});

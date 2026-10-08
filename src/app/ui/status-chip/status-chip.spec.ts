import { TestBed } from '@angular/core/testing';
import { ProductStatus, UiStatusChip } from './status-chip';

describe('UiStatusChip', () => {
  async function render(status: ProductStatus): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(UiStatusChip);
    fixture.componentRef.setInput('status', status);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  it('labels a live product "Live" with the filled dot', async () => {
    const chip = await render('live');
    expect(chip.textContent).toBe('Live');
    expect(chip.className).toBe('ui-status-chip--live');
  });

  it('labels a product in development "In development" with the ring', async () => {
    const chip = await render('in-development');
    expect(chip.textContent).toBe('In development');
    expect(chip.className).toBe('ui-status-chip--in-development');
  });
});

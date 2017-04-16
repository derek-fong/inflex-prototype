import { InflexPage } from './app.po';

describe('inflex App', () => {
  let page: InflexPage;

  beforeEach(() => {
    page = new InflexPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('ix works!');
  });
});

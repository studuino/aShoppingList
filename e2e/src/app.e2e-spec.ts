import {AppPage} from './app.po';

describe('new App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });
  describe('default screen', () => {
    beforeEach(() => {
      page.navigateTo('/shopping');
    });
    it('should have a title saying Please Login', async () => {
      const result = await page.getElementByClass('ion-input').getAttribute('ng-reflect-placeholder');
      console.log(result);
      expect(result).toBeTruthy();
    });
  });
});

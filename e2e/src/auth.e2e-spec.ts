import { TestAuthPage } from './auth.po';

describe('new App', () => {
  let page: TestAuthPage;

  beforeEach(() => {
    page = new TestAuthPage();
  });
  describe('Login Page', () => {
    beforeEach(() => {
      page.navigateTo('/login');
    });
    it('should have a title saying Please Login', async () => {
      const title = await page.getTextBySelector('app-login ion-title');
      expect(title).toBeTruthy('Page did not have a title');
      const expectedTitle = 'Please Login';
      expect(title).toBe(expectedTitle);
    });
  });
});

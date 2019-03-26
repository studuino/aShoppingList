import { $, browser, WebElement } from 'protractor';

export class TestAuthPage {
  navigateTo(destination) {
    return browser.get(destination);
  }

  async getTextBySelector(selector: string) {
    return (await $(selector)).getText();
  }

  getInputPlaceholderText(className) {
    this.getElementByClass(className).getAttribute('ng-reflect-placeholder');
  }

  private getElementByClass(className: string): WebElement {
    return browser.$(className).getWebElement();
  }
}

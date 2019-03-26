import {browser, by, element} from 'protractor';

export class AppPage {
  navigateTo(destination) {
    return browser.get(destination);
  }

  getTitle() {
    return browser.getTitle();
  }

  getElementByClass(className: string) {
    return browser.$(className).getWebElement();
  }

  getPageOneTitleText() {
    return element(by.tagName('a-shopping-list')).element(by.deepCss('ion-title')).getText();
  }
}

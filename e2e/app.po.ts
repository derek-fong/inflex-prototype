import { browser, element, by } from 'protractor';

export class InflexPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('ix-root h1')).getText();
  }
}

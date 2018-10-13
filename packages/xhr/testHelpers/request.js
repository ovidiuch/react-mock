// @flow
/* global XMLHttpRequest */

export async function request(
  url: string,
  { method = 'GET' }: { method?: string } = {}
) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.addEventListener('load', () => {
      try {
        resolve(xhr);
      } catch (err) {
        reject(err);
      }
    });
    // $FlowFixMe
    xhr.addEventListener('error', err => {
      reject(err);
    });
    xhr.send();
  });
}
